import { NextResponse } from 'next/server';
import emailjs from '@emailjs/nodejs';

emailjs.init({
  publicKey: "fPL_SDe29nZUcHUdi",
  privateKey: "etLlEX546G7NTw8C5aAJp", // Use environment variable
});

export async function POST(req) {
  try {
    const templateParams = {
      to_email: "raghav4u03@gmail.com",
      // Add other template parameters as needed
    };

    const response = await emailjs.send('service_3v512os', 'template_l74q4n3', templateParams, options);

    console.log('SUCCESS!', response.status, response.text);
    return NextResponse.json({ message: 'Email sent successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ message: 'Failed to send email.', error: error.toString() }, { status: 500 });
  }
}