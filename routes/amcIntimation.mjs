import express from "express";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import schedule from "node-schedule";
import amcModel from "../models/master/amcModel.mjs";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API);

const router = express.Router();

const sendReminderEmail = async (dueDate, service_name, daysBefore) => {
  const currentDate = new Date();

  if (dueDate.getTime() > currentDate.getTime()) {
    const formattedDueDate = dueDate.toISOString().split("T")[0];

    const emailMessage = {
      to: ["chirag@surajforwarders.com", "accounts@surajforwarders.com"],
      from: "helpdesk@alluvium.in",
      subject: "Payment Reminder",
      text: `This is a reminder that your payment for AMC, service name- ${service_name} is due on ${formattedDueDate}. Please make the payment on time.`,
    };

    // Send the email
    await sgMail.send(emailMessage);

    console.log(`Email sent ${daysBefore} days before the due date`);
  } else {
    console.log(`Due date has already passed for AMC. No email sent.`);
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

    const amcItems15Days = await amcModel.find({
      end_date: dueDate15Days.toISOString().split("T")[0],
    });
    const amcItems7Days = await amcModel.find({
      end_date: dueDate7Days.toISOString().split("T")[0],
    });
    const amcItems1Day = await amcModel.find({
      end_date: dueDate1Day.toISOString().split("T")[0],
    });

    amcItems15Days.forEach(async (amcItem) => {
      const { service_name } = amcItem;
      await sendReminderEmail(dueDate15Days, service_name, 15);
    });

    amcItems7Days.forEach(async (amcItem) => {
      const { service_name } = amcItem;
      await sendReminderEmail(dueDate7Days, service_name, 7);
    });

    amcItems1Day.forEach(async (amcItem) => {
      const { service_name } = amcItem;
      await sendReminderEmail(dueDate1Day, service_name, 1);
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;
