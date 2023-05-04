import request from "supertest";
import { app } from "../../app";

// it is just an alias to test :)
it("returns a 201 on successfull signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

test("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "adfadfadf",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app) // await also works instead of return.
    .post("/api/users/signup")
    .send({
      email: "adfadfadf",
      password: "p",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);

  return request(app)
    .post("/api/users/signup")
    .send({
      password: "dafadf",
    })
    .expect(400);
});

test("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("sets a cookie after successful cookie", async () => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  expect(res.get("Set-Cookie")).toBeDefined();
  //this will fail (coz the req is only send by HTTPS since we set secure: true while using
  // cookieSession middleware in app.ts)
});
