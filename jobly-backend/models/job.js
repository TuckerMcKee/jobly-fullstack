"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for jobs. */

class Job {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, companyHandle }
   *
   * Returns { title, salary, equity, companyHandle }
   *
   * Throws BadRequestError if job already in database.
   * */

  static async create({ title, salary, equity, companyHandle }) {
    const duplicateCheck = await db.query(
          `SELECT title
           FROM jobs
           WHERE title = $1 AND company_handle = $2`,
        [title,companyHandle]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate job: ${title} at ${companyHandle}`);

    const result = await db.query(
          `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING title, salary, equity, company_handle AS "companyHandle"`,
        [
          title,
          salary,
          equity,
          companyHandle
        ]
    );
    const job = result.rows[0];

    return job;
  }

  /** Find all jobs.
   * Accepts optional filters object containg 3 optional filters >>> { titleLike, minSalary, hasEquity }
   * Returns [{ title, salary, equity, companyHandle }, ...]
   * */

  static async findAll(filters) { // added ID to the query to be accessible on frontend 
    let baseQuery = `SELECT id, title,
    salary,
    equity,
    company_handle AS "companyHandle"
    FROM jobs`;
    if (filters) {
      if (Object.keys(filters).length !== 0) {
      
      baseQuery += ' WHERE';

      if (filters["titleLike"]) {

        baseQuery += ` LOWER(title) LIKE LOWER('%${filters["titleLike"]}%')`;

      }
      if (filters["minSalary"]) {
        if (Object.keys(filters).length > 1) {
          baseQuery += ' AND'
        }

        baseQuery += ` Salary >= ${filters["minSalary"]}`;

      }

      if (filters["hasEquity"]) {
        if (Object.keys(filters).length > 1) {
          baseQuery += ' AND'
        }
        
        baseQuery += ` equity > 0`;

      }
    }};
    baseQuery += ` ORDER BY title`;
    const jobsRes = await db.query(baseQuery);
    
    return jobsRes.rows;
  }

  /** Given a job title, return data about job.
   *
   * Returns { title, salary, equity, companyHandle }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(title) {
    const jobRes = await db.query(
          `SELECT title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
           FROM jobs
           WHERE title = $1`,
        [title]);

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`No job: ${title}`);

    return job;
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {title, salary, equity}
   *
   * Returns {title, salary, equity, companyHandle}
   *
   * Throws NotFoundError if not found.
   */

  static async update(title, data) {
    const updateCols = ["title","salary","equity"];

    Object.keys(data).forEach(val => {
      if (val === "companyHandle" || updateCols.indexOf(val) === -1) {
        throw new BadRequestError(`invalid data: ${val}`);
      }
    });
    const { setCols, values } = sqlForPartialUpdate(data,{});
    const titleVarIdx = "$" + (values.length + 1);
    const CompanyHandleVarIdx = "$" + (values.length + 2);

    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE title = ${titleVarIdx}
                      RETURNING title, 
                                salary, 
                                equity, 
                                company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, title]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${title}`);

    return job;
  }

  /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

  static async remove(title) {
    const result = await db.query(
          `DELETE
           FROM jobs
           WHERE title = $1
           RETURNING title`,
        [title]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${title}`);
  }
}


module.exports = Job;
