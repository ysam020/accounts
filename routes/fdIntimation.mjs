import express from "express";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import schedule from "node-schedule";
import fdModel from "../models/master/FdModel.mjs";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API);

const router = express.Router();

const sendReminderEmail = async (endDate, company_name, daysBefore) => {
  const currentDate = new Date();

  if (endDate.getTime() > currentDate.getTime()) {
    const formattedDueDate = endDate.toISOString().split("T")[0];

    const emailMessage = {
      to: ["chirag@surajforwarders.com", "accounts@surajforwarders.com"],
      from: "helpdesk@alluvium.in",
      subject: "Payment Reminder",
      text: `This is a reminder that your payment for FD (${company_name}) is due on ${formattedDueDate}. Please make the payment on time.`,
    };

    // Send the email
    await sgMail.send(emailMessage);

    console.log(`Email sent ${daysBefore} days before the due date`);
  } else {
    console.log(`Due date has already passed for FD. No email sent.`);
  }
};

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

    const fdItems15Days = await fdModel.find({
      end_date: dueDate15Days.toISOString().split("T")[0],
    });
    const fdItems7Days = await fdModel.find({
      end_date: dueDate7Days.toISOString().split("T")[0],
    });
    const fdItems1Day = await fdModel.find({
      end_date: dueDate1Day.toISOString().split("T")[0],
    });

    fdItems15Days.forEach(async (fdItem) => {
      const { comapny_name } = fdItem;
      await sendReminderEmail(dueDate15Days, comapny_name, 15);
    });

    fdItems7Days.forEach(async (fdItem) => {
      const { comapny_name } = fdItem;
      await sendReminderEmail(dueDate7Days, comapny_name, 7);
    });

    fdItems1Day.forEach(async (fdItem) => {
      const { comapny_name } = fdItem;
      await sendReminderEmail(dueDate1Day, comapny_name, 1);
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;
