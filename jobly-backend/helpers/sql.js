const { BadRequestError } = require("../expressError");

/**
 * Generates a SQL query string and values for partial updates.
 *
 *  dataToUpdate - An object where keys are column names and values are the new data to update.
 *  jsToSql - An object mapping JavaScript-style column names to SQL-style column names 
 *                           (e.g., { numEmployees: "num_employees" }).
 *
 * return value - An object containing:
 *    - `setCols`: A string with the SQL "SET" clause (e.g., '"first_name"=$1, "age"=$2').
 *    - `values`: An array of values to be used in the SQL query.
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );
  
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
