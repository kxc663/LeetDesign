export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const now = Date.now();
    const cooldown = 60 * 1000;

    const existing = await redis.get<{ code: string; timestamp: number }>(email);
    if (existing && now - existing.timestamp < cooldown) {
      const wait = Math.ceil((cooldown - (now - existing.timestamp)) / 1000);
      return NextResponse.json(
        { error: `Please wait ${wait} seconds before requesting a new code` },
        { status: 429 }
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 保存验证码，有效期10分钟
    await redis.set(email, { code, timestamp: now }, { ex: 600 });

    // ⬇️ 在这里动态引入 nodemailer，避免构建时报错
    const nodemailer = (await import('nodemailer')).default;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER!,
      to: email,
      subject: 'Verify your email for LeetDesign',
      html: `
        <h1>Email Verification</h1>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    return NextResponse.json({ message: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });
  }
}
