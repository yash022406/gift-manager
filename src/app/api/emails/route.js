import Invitation from "../../../emails/Invitation";
import { Resend } from "resend";

const resend = new Resend("re_Y5X7RbHJ_BshEwGmx5ghMk7AV6ShAy1iK");

export async function POST(req) {
  try {

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['yashsain.2406@gmail.com', '20ucc119@lnmiit.ac.in'],
      subject: 'INVITATION: GiftManager Event',
      react: Invitation(),
    });
    return new Response(JSON.stringify(result), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}