import axios from "axios";

const BASE_URL = "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      const res = (await axios({ url, method, data, params, headers })).data
      return res
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Log user in. */

  static async userLogin(username,password) {
    let res = await this.request(`auth/token`,{username,password},'post');
    return res.token;
  }

  /** Registers new user. */

  static async userSignUp(username,password,firstName,lastName,email) {
    let res = await this.request(`auth/register`,{username,password,firstName,lastName,email},'post');
    return res.token;
  }

  /** Get user data. */

  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Patch user data. */

  static async patchUser(username,data) {
    let res = await this.request(`users/${username}`,data,'patch');
    return res.user;
  }

  /** Get details on a company by handle. */

  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  /** Get all companies. */

  static async getCompanies() {
    let res = await this.request(`companies`);
    return res.companies;
  }

  /** Get company by handle. */

  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  /** Get all companies by filtered by name. */

  static async getCompaniesByName(nameLike) {
    let res = await this.request(`companies`,{nameLike});
    console.log('in api getCompaniesByName, res:  ',res)
    return res.companies;
  }

  /** Get all jobs. */

  static async getJobs() {
    let res = await this.request(`jobs`);
    return res.jobs;
  }

  /** Get all jobs by filtered by title. */

  static async getJobsByTitle(titleLike) {
    let res = await this.request(`jobs`,{titleLike});
    return res.jobs;
  }

  /** Creates a job application with username and job. */

  static async postJobApp(username,jobId) {
    let res = await this.request(`users/${username}/jobs/${jobId}`,{},'post');
    return res;
  }

  // obviously, you'll add a lot here ...
}

// for now, put token ("testuser" / "password" on class)
JoblyApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
    "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
    "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default JoblyApi;    