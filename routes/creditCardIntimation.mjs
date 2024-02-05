import express from "express";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import schedule from "node-schedule";
import ccModel from "../models/master/creditCardModel.mjs";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API);

const router = express.Router();

const sendReminderEmail = async (dueDate, cc_no, company_name, daysBefore) => {
  const currentDate = new Date();

  if (dueDate.getTime() > currentDate.getTime()) {
    const formattedDueDate = dueDate.toISOString().split("T")[0];

    const emailMessage = {
      to: ["chirag@surajforwarders.com", "accounts@surajforwarders.com"],
      from: "helpdesk@alluvium.in",
      subject: "Payment Reminder",
      text: `This is a reminder that your payment for Credit Card number- ${cc_no} (${company_name}) is due on ${formattedDueDate}. Please make the payment on time.`,
    };

    // Send the email
    await sgMail.send(emailMessage);

    console.log(`Email sent ${daysBefore} days before the due date`);
  } else {
    console.log(`Due date has already passed for Credit Card. No email sent.`);
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

    const ccItems15Days = await ccModel.find({
      due_date: dueDate15Days.toISOString().split("T")[0],
    });
    const ccItems7Days = await ccModel.find({
      due_date: dueDate7Days.toISOString().split("T")[0],
    });
    const ccItems1Day = await ccModel.find({
      due_date: dueDate1Day.toISOString().split("T")[0],
    });

    ccItems15Days.forEach(async (ccItem) => {
      const { cc_no, comapny_name } = ccItem;
      await sendReminderEmail(dueDate15Days, cc_no, comapny_name, 15);
    });

    ccItems7Days.forEach(async (ccItem) => {
      const { cc_no, comapny_name } = ccItem;
      await sendReminderEmail(dueDate7Days, cc_no, comapny_name, 7);
    });

    ccItems1Day.forEach(async (ccItem) => {
      const { cc_no, comapny_name } = ccItem;
      await sendReminderEmail(dueDate1Day, cc_no, comapny_name, 1);
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;
