"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
  const newJob = {
    title: "new",
    salary: 50000,
    equity: 0.1,
    companyHandle: "c1",
  };

  test("works for admin", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        title: "new",
        salary: 50000,
        equity: "0.1",
        companyHandle: "c1",
      }
    });
  });

  test("fails for non-admin", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
    expect(resp.body.error.message).toEqual('Unauthorized');
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({})
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
          ...newJob,
          logoUrl: "not-a-url",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /jobs */

describe("GET /jobs", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
   
    expect(resp.body).toEqual({
      jobs:
          [
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
          ],
    });
  });

  test("titleLike filter works", async function () {
    const resp = await request(app).get("/jobs").send({titleLike:"an"});
    expect(resp.body).toEqual({
      jobs:
          [
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
            }
          ],
    });
  });

  
  test("minSalary filter works", async function () {
    const resp = await request(app).get("/jobs").send({minSalary:50000});
    expect(resp.body).toEqual({
      jobs:
          [
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
          ],
    });
  });
  test("hasEquity filter works", async function () {
    const resp = await request(app).get("/jobs").send({hasEquity:true});
    expect(resp.body).toEqual({
      jobs:
          [
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
          ],
    });
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE jobs CASCADE");
    const resp = await request(app)
        .get("/jobs")
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /jobs/:title */

describe("GET /jobs/:title", function () {
  test("works for anon", async function () {
    const resp = await request(app).get(`/jobs/accountant`);
    expect(resp.body).toEqual({
      job: {
        title: "accountant",
        salary: 80000,
        equity: "0.01",
        companyHandle: "c3",
    },
    });
  });

  test("not found for no such job", async function () {
    const resp = await request(app).get(`/jobs/nope`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /jobs/:title */

describe("PATCH /jobs/:title", function () {
  test("works for admin", async function () {
    const resp = await request(app)
        .patch(`/jobs/accountant`)
        .send({
            title: "pilot",
            salary: 100000,
            equity: 0.02,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      job: {
        title: "pilot",
        salary: 100000,
        equity: "0.02",
        companyHandle:"c3"
    },
    });
  });

  test("fails for non-admin users", async function () {
    const resp = await request(app)
        .patch(`/jobs/janitor`)
        .send({
          title: "new",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body.error.status).toEqual(401);
    expect(resp.body.error.message).toEqual('Unauthorized');
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/jobs/janitor`)
        .send({
          name: "new",
        });
        
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such job", async function () {
    const resp = await request(app)
        .patch(`/jobs/nope`)
        .send({
          title: "new nope",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on companyHandle change attempt", async function () {
    const resp = await request(app)
        .patch(`/jobs/janitor`)
        .send({
          companyHandle: "c1-new",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async function () {
    const resp = await request(app)
        .patch(`/jobs/janitor`)
        .send({
          logoUrl: "not-a-url",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /jobs/:title */

describe("DELETE /jobs/:title", function () {
  test("works for admin", async function () {
    const resp = await request(app)
        .delete(`/jobs/janitor`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: "janitor" });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/jobs/accountant`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such job", async function () {
    const resp = await request(app)
        .delete(`/jobs/nope`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

