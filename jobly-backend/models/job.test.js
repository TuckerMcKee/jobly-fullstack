"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "new",
    salary: 50000,
    equity: "0.1",
    companyHandle: "c1",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual(newJob);

    const result = await db.query(
          `SELECT title, salary, equity, company_handle AS "companyHandle"
           FROM jobs
           WHERE title = 'new'`);
    expect(result.rows).toEqual([
        {
            title: "new",
            salary: 50000,
            equity: "0.1",
            companyHandle: "c1",
          },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
        await Job.create(newJob);
        await Job.create(newJob);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
        {
            title: "accountant",
            salary: 80000,
            equity: "0.01",
            companyHandle: "c3",
        },
        {
            title: "engineer",
            salary: 70000,
            equity: "0.02",
            companyHandle: "c1",
        },
        {
            title: "janitor",
            salary: 40000,
            equity: "0",
            companyHandle: "c1",
        },
    ]);
  });

  test("works: titleLike filter", async function () {

    let jobs = await Job.findAll({titleLike:"an"});
    expect(jobs).toEqual([
        {
            title: "accountant",
            salary: 80000,
            equity: "0.01",
            companyHandle: "c3",
        },
        {
            title: "janitor",
            salary: 40000,
            equity: "0",
            companyHandle: "c1",
        },
        
    ]);
  });

  test("works: minSalary filter", async function () {

    let jobs = await Job.findAll({minSalary:50000});
    expect(jobs).toEqual([
        {
            title: "accountant",
            salary: 80000,
            equity: "0.01",
            companyHandle: "c3",
        },
        {
            title: "engineer",
            salary: 70000,
            equity: "0.02",
            companyHandle: "c1",
        },
    ]);
  });

  test("works: hasEquity filter", async function () {

    let jobs = await Job.findAll({hasEquity:true});
    expect(jobs).toEqual([
        {
            title: "accountant",
            salary: 80000,
            equity: "0.01",
            companyHandle: "c3",
        },
        {
            title: "engineer",
            salary: 70000,
            equity: "0.02",
            companyHandle: "c1",
        },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.get("janitor");
    expect(job).toEqual({
        title: "janitor",
        salary: 40000,
        equity: "0",
        companyHandle: "c1",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "pilot",
    salary: 100000,
    equity: "0.02",
};

  test("works", async function () {
    let job = await Job.update("accountant", updateData);
    expect(job).toEqual({
      title: "pilot",
      salary: 100000,
      equity: "0.02",
      companyHandle:"c3"
  });

    const result = await db.query(
          `SELECT title, salary, equity, company_handle AS "companyHandle"
           FROM jobs
           WHERE title = 'pilot'`);
    expect(result.rows).toEqual([{
        title: "pilot",
        salary: 100000,
        equity: "0.02",
        companyHandle: "c3",
    }]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
        title: "test",
        salary: null,
        equity: null,
    };

    let job = await Job.update("janitor",updateDataSetNulls);
    expect(job).toEqual({
      title: "test",
      salary: null,
      equity: null,
      companyHandle:"c1"
  });

    const result = await db.query(
        `SELECT title, salary, equity, company_handle AS "companyHandle"
         FROM jobs
         WHERE title = 'test'`);
    expect(result.rows).toEqual([{
        title: "test",
        salary: null,
        equity: null,
        companyHandle: "c1"
    }]);
  });

  test("not found if no such company", async function () {
    try {
      await Job.update("nope", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update("engineer", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove("engineer");
    const res = await db.query(
        "SELECT title FROM jobs WHERE title='engineer'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
