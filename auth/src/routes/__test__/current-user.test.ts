import request from "supertest";
import { app } from "../../app";

it("respons with details abt the curr user", async () => {
  //   const signupRes = await request(app)
  //     .post("/api/users/signup")
  //     .send({
  //       email: "test@test.com",
  //       password: "password",
  //     })
  //     .expect(201);
  //   const cookie = signupRes.get("Set-Cookie");
  const cookie = await global.signin(); //even signin() works!!

  const res = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(res.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const res = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(res.body.currentUser).toEqual(null);
});
