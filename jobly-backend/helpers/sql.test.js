const { sqlForPartialUpdate } = require("./sql.js");
const { BadRequestError } = require("../expressError");

describe("sqlForPartialUpdate", function () {
    test("works", function () {
      const data = {"numEmployees":100,"logoUrl":"testUrl"}
      const {setCols, values} = sqlForPartialUpdate(data, {
        numEmployees: "num_employees",
        logoUrl: "logo_url",
      });
      expect(setCols).toEqual('"num_employees"=$1, "logo_url"=$2');
      expect(values).toEqual([100,"testUrl"]);
    });
  
    test("throws error for missing data", function () {
        try {
            const data = {}
            sqlForPartialUpdate(data,{numEmployees: "num_employees",logoUrl: "logo_url"})
        } catch (e) {
            expect(e).toBeInstanceOf(BadRequestError);
            expect(e.message).toBe("No data");
        }
      });
  });
  