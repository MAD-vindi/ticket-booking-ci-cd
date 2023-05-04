import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

test("returns a status 404 if the provided ID does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "adafdf",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "adafdf",
      price: 20,
    })
    .expect(401);
});

test("returns a 401 if the user does not own the ticket", async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "adfadf",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "fadfadfafa",
      price: 1000,
    })
    .expect(401);

  // if the same user hit the update route the status should not be 401
  const dummy = await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "adfadfad",
      price: 20,
    });
  expect(dummy.status).not.toEqual(401);
});

test("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "adfadf",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "adfadf",
      price: -30,
    })
    .expect(400);
});

test("updates the tickets provided valid inputs", async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "adfadf",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new_title",
      price: 100,
    })
    .expect(200);

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send();

  expect(ticketRes.body.title).toEqual("new_title");
  expect(ticketRes.body.price).toEqual(100);
});

it("publishes an event", async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "adfadf",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new_title",
      price: 100,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

test("rejects updates if the ticket is reserved", async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "adfadf",
      price: 20,
    });

  const ticket = await Ticket.findById(res.body.id);
  ticket?.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket?.save();

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new_title",
      price: 100,
    })
    .expect(400);
});
