import express from "express";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import schedule from "node-schedule";
import AdaniModel from "../models/master/adaniModel.mjs";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API);

const router = express.Router();

const sendReminderEmail = async (dueDate, service_no, daysBefore) => {
  const currentDate = new Date();

  if (dueDate.getTime() > currentDate.getTime()) {
    const formattedDueDate = dueDate.toISOString().split("T")[0];

    const emailMessage = {
      to: ["chirag@surajforwarders.com", "accounts@surajforwarders.com"],
      from: "helpdesk@alluvium.in",
      subject: "Payment Reminder",
      text: `This is a reminder that your payment for Adani Gas, service number- ${service_no} is due on ${formattedDueDate}. Please make the payment on time.`,
    };

    // Send the email
    await sgMail.send(emailMessage);

    console.log(`Email sent ${daysBefore} days before the due date`);
  } else {
    console.log(`Due date has already passed for Adani Gas. No email sent.`);
  }
};

// schedule.scheduleJob("*/10 * * * * *", async () => {
schedule.scheduleJob("00 09 * * *", async () => {
  try {
    const currentDate = new Date();
    const dueDate15Days = new Date(
      currentDate.getTime() + 15 * 24 * 60 * 60 * 1000
    );
    const dueDate7Days = new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    const dueDate1Day = new Date(
      currentDate.getTime() + 1 * 24 * 60 * 60 * 1000
    );

    const adaniItems15Days = await AdaniModel.find({
      due_date: dueDate15Days.toISOString().split("T")[0],
    });
    const adaniItems7Days = await AdaniModel.find({
      due_date: dueDate7Days.toISOString().split("T")[0],
    });
    const adaniItems1Day = await AdaniModel.find({
      due_date: dueDate1Day.toISOString().split("T")[0],
    });

    adaniItems15Days.forEach(async (adaniItem) => {
      const { service_no } = adaniItem;
      await sendReminderEmail(dueDate15Days, service_no, 15);
    });

    adaniItems7Days.forEach(async (adaniItem) => {
      const { service_no } = adaniItem;
      await sendReminderEmail(dueDate7Days, service_no, 7);
    });

    adaniItems1Day.forEach(async (adaniItem) => {
      const { service_no } = adaniItem;
      await sendReminderEmail(dueDate1Day, service_no, 1);
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;
