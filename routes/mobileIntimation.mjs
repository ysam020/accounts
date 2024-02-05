import express from "express";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import schedule from "node-schedule";
import mobileModel from "../models/master/mobileModel.mjs";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API);

const router = express.Router();

const sendReminderEmail = async (
  dueDate,
  service_no,
  company_name,
  daysBefore
) => {
  const currentDate = new Date();

  if (dueDate.getTime() > currentDate.getTime()) {
    const formattedDueDate = dueDate.toISOString().split("T")[0];

    const emailMessage = {
      to: ["chirag@surajforwarders.com", "accounts@surajforwarders.com"],
      from: "helpdesk@alluvium.in",
      subject: "Payment Reminder",
      text: `This is a reminder that your payment for Mobile, service number- ${service_no} (Company- ${company_name}) is due on ${formattedDueDate}. Please make the payment on time.`,
    };

    // Send the email
    await sgMail.send(emailMessage);

    console.log(`Email sent ${daysBefore} days before the due date`);
  } else {
    console.log(`Due date has already passed for Mobile. No email sent.`);
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

    const mobileItems15Days = await mobileModel.find({
      due_date: dueDate15Days.toISOString().split("T")[0],
    });
    const mobileItems7Days = await mobileModel.find({
      due_date: dueDate7Days.toISOString().split("T")[0],
    });
    const mobileItems1Day = await mobileModel.find({
      due_date: dueDate1Day.toISOString().split("T")[0],
    });

    mobileItems15Days.forEach(async (mobileItem) => {
      const { service_no, company_name } = mobileItem;
      await sendReminderEmail(dueDate15Days, service_no, company_name, 15);
    });

    mobileItems7Days.forEach(async (mobileItem) => {
      const { service_no, company_name } = mobileItem;
      await sendReminderEmail(dueDate7Days, service_no, company_name, 7);
    });

    mobileItems1Day.forEach(async (mobileItem) => {
      const { service_no, company_name } = mobileItem;
      await sendReminderEmail(dueDate1Day, service_no, company_name, 1);
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;
