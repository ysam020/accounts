import express from "express";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import schedule from "node-schedule";
import RentModel from "../models/master/rentModel.mjs";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API);

const router = express.Router();

const sendReminderEmail = async (
  endDate,
  tenant_name,
  property_in_name_of,
  daysBefore
) => {
  const currentDate = new Date();

  if (endDate.getTime() > currentDate.getTime()) {
    const formattedDueDate = endDate.toISOString().split("T")[0];

    const emailMessage = {
      to: ["chirag@surajforwarders.com", "accounts@surajforwarders.com"],
      from: "helpdesk@alluvium.in",
      subject: "Payment Reminder",
      text: `This is a reminder that your payment for Rent, tenant name- ${tenant_name} (${property_in_name_of}) is due on ${formattedDueDate}. Please make the payment on time.`,
    };

    // Send the email
    await sgMail.send(emailMessage);

    console.log(`Email sent ${daysBefore} days before the due date`);
  } else {
    console.log(`Due date has already passed for Rent. No email sent.`);
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

    const rentItems15Days = await RentModel.find({
      end_date: dueDate15Days.toISOString().split("T")[0],
    });
    const rentItems7Days = await RentModel.find({
      end_date: dueDate7Days.toISOString().split("T")[0],
    });
    const rentItems1Day = await RentModel.find({
      end_date: dueDate1Day.toISOString().split("T")[0],
    });

    rentItems15Days.forEach(async (rentItem) => {
      const { tenant_name, property_in_name_of } = rentItem;
      await sendReminderEmail(
        dueDate15Days,
        tenant_name,
        property_in_name_of,
        15
      );
    });

    rentItems7Days.forEach(async (rentItem) => {
      const { tenant_name, property_in_name_of } = rentItem;
      await sendReminderEmail(
        dueDate7Days,
        tenant_name,
        property_in_name_of,
        7
      );
    });

    rentItems1Day.forEach(async (rentItem) => {
      const { tenant_name, property_in_name_of } = rentItem;
      await sendReminderEmail(dueDate1Day, tenant_name, property_in_name_of, 1);
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;
