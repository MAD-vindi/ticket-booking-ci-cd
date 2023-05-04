import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@vintickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
