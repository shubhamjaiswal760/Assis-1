import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load sales data from CSV file
 * In production, this would connect to a database
 */
export const loadSalesData = () => {
  try {
    // For now, return empty array - data will be loaded via API or file upload
    // In production, this would read from database
    return [];
  } catch (error) {
    console.error('Error loading sales data:', error);
    return [];
  }
};

/**
 * Parse CSV data to JSON
 * Handles quoted fields and commas within quoted values
 * Optimized for large files
 */
export const parseCSV = (csvText) => {
  if (!csvText || typeof csvText !== 'string' || csvText.trim().length === 0) {
    return [];
  }

  // Remove BOM if present
  if (csvText.charCodeAt(0) === 0xFEFF) {
    csvText = csvText.slice(1);
  }

  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;
  const len = csvText.length;

  while (i < len) {
    const char = csvText[i];
    const nextChar = i + 1 < len ? csvText[i + 1] : null;

    if (char === '"') {
      if (inQuotes) {
        // Check for escaped quote ("")
        if (nextChar === '"') {
          currentField += '"';
          i += 2;
          continue;
        }
        // Check if quote is followed by comma, newline, or end of string (end of quoted field)
        if (nextChar === ',' || nextChar === '\n' || nextChar === '\r' || nextChar === null) {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        // Start of quoted field
        inQuotes = true;
      }
      i++;
    } else if (char === ',' && !inQuotes) {
      // End of field
      currentRow.push(currentField);
      currentField = '';
      i++;
    } else if (char === '\n' && !inQuotes) {
      // End of row
      currentRow.push(currentField);
      currentField = '';
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
      currentRow = [];
      i++;
    } else if (char === '\r' && !inQuotes) {
      // Handle \r\n or just \r
      if (nextChar === '\n') {
        currentRow.push(currentField);
        currentField = '';
        if (currentRow.length > 0) {
          rows.push(currentRow);
        }
        currentRow = [];
        i += 2;
      } else {
        currentRow.push(currentField);
        currentField = '';
        if (currentRow.length > 0) {
          rows.push(currentRow);
        }
        currentRow = [];
        i++;
      }
    } else {
      currentField += char;
      i++;
    }
  }

  // Handle last field/row if file doesn't end with newline
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) {
    return [];
  }

  // First row is headers - trim whitespace and remove internal spaces
  const rawHeaders = rows[0];
  const headers = rawHeaders.map(h => {
    const trimmed = String(h || '').trim();
    // Remove ALL spaces from column names (e.g., "Customer I D" -> "CustomerID")
    const cleaned = trimmed.replace(/\s+/g, '');
    return cleaned;
  });
  
  console.log('Raw headers:', rawHeaders.slice(0, 5));
  console.log('Cleaned headers:', headers.slice(0, 5));
  
  const data = [];

  // Process data rows
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const record = {};
    
    // Map each header to its corresponding value
    headers.forEach((header, index) => {
      const value = row[index];
      record[header] = value !== undefined && value !== null ? String(value).trim() : '';
    });
    
    // Only add non-empty rows
    if (Object.keys(record).length > 0) {
      data.push(record);
    }
  }

  return data;
};

/**
 * Parse CSV file using streaming (memory efficient for large files)
 * Processes file in chunks instead of loading entire file into memory
 */
export const parseCSVStream = async (filePath) => {
  return new Promise((resolve, reject) => {
    const data = [];
    let headers = null;
    let rowCount = 0;

    // Read file in chunks
    const CHUNK_SIZE = 64 * 1024; // 64KB chunks
    const fileStream = createReadStream(filePath, { 
      encoding: 'utf8',
      highWaterMark: CHUNK_SIZE 
    });

    let buffer = '';
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;
    let isFirstRow = true;

    const processBuffer = () => {
      let i = 0;
      while (i < buffer.length) {
        const char = buffer[i];
        const nextChar = i + 1 < buffer.length ? buffer[i + 1] : null;

        if (char === '"') {
          if (inQuotes) {
            // Check for escaped quote ("")
            if (nextChar === '"') {
              currentField += '"';
              i += 2;
              continue;
            }
            // Check if quote is followed by comma, newline, or end of buffer
            if (nextChar === ',' || nextChar === '\n' || nextChar === '\r' || nextChar === null) {
              inQuotes = false;
              i++;
              continue;
            }
          } else {
            // Start of quoted field
            inQuotes = true;
          }
          i++;
        } else if (char === ',' && !inQuotes) {
          // End of field
          currentRow.push(currentField);
          currentField = '';
          i++;
        } else if (char === '\n' && !inQuotes) {
          // End of row
          currentRow.push(currentField);
          currentField = '';
          
          if (currentRow.length > 0) {
            if (isFirstRow) {
              // First row is headers - clean up spaces in header names
              headers = currentRow.map(h => {
                const trimmed = String(h || '').trim();
                // Remove spaces between letters in column names
                return trimmed.replace(/\s+/g, '');
              });
              isFirstRow = false;
            } else {
              // Data row
              const record = {};
              headers.forEach((header, index) => {
                const value = currentRow[index];
                record[header] = value !== undefined && value !== null ? String(value).trim() : '';
              });
              if (Object.keys(record).length > 0) {
                data.push(record);
                rowCount++;
                // Log progress for large files
                if (rowCount % 10000 === 0) {
                  console.log(`Processed ${rowCount} rows...`);
                }
              }
            }
          }
          currentRow = [];
          i++;
        } else if (char === '\r' && !inQuotes) {
          // Handle \r\n or just \r
          if (nextChar === '\n') {
            currentRow.push(currentField);
            currentField = '';
            
            if (currentRow.length > 0) {
              if (isFirstRow) {
                headers = currentRow.map(h => {
                  const trimmed = String(h || '').trim();
                  return trimmed.replace(/\s+/g, '');
                });
                isFirstRow = false;
              } else {
                const record = {};
                headers.forEach((header, index) => {
                  const value = currentRow[index];
                  record[header] = value !== undefined && value !== null ? String(value).trim() : '';
                });
                if (Object.keys(record).length > 0) {
                  data.push(record);
                  rowCount++;
                  if (rowCount % 10000 === 0) {
                    console.log(`Processed ${rowCount} rows...`);
                  }
                }
              }
            }
            currentRow = [];
            i += 2;
          } else {
            currentRow.push(currentField);
            currentField = '';
            
            if (currentRow.length > 0) {
              if (isFirstRow) {
                headers = currentRow.map(h => {
                  const trimmed = String(h || '').trim();
                  return trimmed.replace(/\s+/g, '');
                });
                isFirstRow = false;
              } else {
                const record = {};
                headers.forEach((header, index) => {
                  const value = currentRow[index];
                  record[header] = value !== undefined && value !== null ? String(value).trim() : '';
                });
                if (Object.keys(record).length > 0) {
                  data.push(record);
                  rowCount++;
                  if (rowCount % 10000 === 0) {
                    console.log(`Processed ${rowCount} rows...`);
                  }
                }
              }
            }
            currentRow = [];
            i++;
          }
        } else {
          currentField += char;
          i++;
        }
      }
    };

    fileStream.on('data', (chunk) => {
      buffer += chunk;
      
      // Process buffer, but keep incomplete rows
      let processed = 0;
      let i = 0;
      while (i < buffer.length) {
        const char = buffer[i];
        const nextChar = i + 1 < buffer.length ? buffer[i + 1] : null;

        if (char === '"') {
          if (inQuotes) {
            if (nextChar === '"') {
              currentField += '"';
              i += 2;
              continue;
            }
            if (nextChar === ',' || nextChar === '\n' || nextChar === '\r' || nextChar === null) {
              inQuotes = false;
              i++;
              continue;
            }
          } else {
            inQuotes = true;
          }
          i++;
        } else if (char === ',' && !inQuotes) {
          currentRow.push(currentField);
          currentField = '';
          i++;
        } else if (char === '\n' && !inQuotes) {
          currentRow.push(currentField);
          currentField = '';
          
          if (currentRow.length > 0) {
            if (isFirstRow) {
              headers = currentRow.map(h => String(h || '').trim());
              isFirstRow = false;
            } else {
              const record = {};
              headers.forEach((header, index) => {
                const value = currentRow[index];
                record[header] = value !== undefined && value !== null ? String(value).trim() : '';
              });
              if (Object.keys(record).length > 0) {
                data.push(record);
                rowCount++;
                if (rowCount % 10000 === 0) {
                  console.log(`Processed ${rowCount} rows...`);
                }
              }
            }
          }
          currentRow = [];
          processed = i + 1;
          i++;
        } else if (char === '\r' && !inQuotes) {
          if (nextChar === '\n') {
            currentRow.push(currentField);
            currentField = '';
            
            if (currentRow.length > 0) {
              if (isFirstRow) {
                headers = currentRow.map(h => String(h || '').trim());
                isFirstRow = false;
              } else {
                const record = {};
                headers.forEach((header, index) => {
                  const value = currentRow[index];
                  record[header] = value !== undefined && value !== null ? String(value).trim() : '';
                });
                if (Object.keys(record).length > 0) {
                  data.push(record);
                  rowCount++;
                  if (rowCount % 10000 === 0) {
                    console.log(`Processed ${rowCount} rows...`);
                  }
                }
              }
            }
            currentRow = [];
            processed = i + 2;
            i += 2;
          } else {
            currentRow.push(currentField);
            currentField = '';
            
            if (currentRow.length > 0) {
              if (isFirstRow) {
                headers = currentRow.map(h => String(h || '').trim());
                isFirstRow = false;
              } else {
                const record = {};
                headers.forEach((header, index) => {
                  const value = currentRow[index];
                  record[header] = value !== undefined && value !== null ? String(value).trim() : '';
                });
                if (Object.keys(record).length > 0) {
                  data.push(record);
                  rowCount++;
                  if (rowCount % 10000 === 0) {
                    console.log(`Processed ${rowCount} rows...`);
                  }
                }
              }
            }
            currentRow = [];
            processed = i + 1;
            i++;
          }
        } else {
          currentField += char;
          i++;
        }
      }
      
      // Keep only unprocessed part (incomplete row/field)
      if (processed > 0 && !inQuotes) {
        buffer = buffer.substring(processed);
      } else if (processed === 0 && !inQuotes && buffer.length > CHUNK_SIZE * 2) {
        // Safety: if buffer grows too large, keep only last chunk
        buffer = buffer.substring(buffer.length - CHUNK_SIZE);
      }
    });

    fileStream.on('end', () => {
      // Process remaining buffer
      if (buffer.length > 0) {
        processBuffer();
      }
      
      // Handle last row if incomplete
      if (currentField.length > 0 || currentRow.length > 0) {
        currentRow.push(currentField);
        if (currentRow.length > 0 && !isFirstRow) {
          const record = {};
          headers.forEach((header, index) => {
            const value = currentRow[index];
            record[header] = value !== undefined && value !== null ? String(value).trim() : '';
          });
          if (Object.keys(record).length > 0) {
            data.push(record);
          }
        }
      }

      if (!headers || data.length === 0) {
        reject(new Error('No valid data found in CSV file'));
      } else {
        console.log(`Successfully parsed ${data.length} records`);
        resolve(data);
      }
    });

    fileStream.on('error', (err) => {
      reject(new Error(`Error reading file: ${err.message}`));
    });
  });
};

