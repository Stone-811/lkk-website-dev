import nodemailer from 'nodemailer';
import { db } from './firebase';

// Email transporter configuration
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('SMTP configuration missing. Email notifications disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

// Get notification settings from Firestore
async function getNotificationSettings() {
  try {
    const settingsDoc = await db.collection('settings').doc('notifications').get();
    if (settingsDoc.exists) {
      return settingsDoc.data() as {
        emailOnNewLead: boolean;
        emailRecipients: string;
      };
    }
    // Default settings
    return {
      emailOnNewLead: true,
      emailRecipients: process.env.NOTIFICATION_EMAIL || '',
    };
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return null;
  }
}

// Lead type labels
const leadTypeLabels: Record<string, string> = {
  booking: '預約體驗',
  franchise: '加盟洽詢',
  cooperation: '合作洽詢',
};

interface LeadNotificationData {
  type: 'booking' | 'franchise' | 'cooperation';
  name: string;
  phone: string;
  email?: string;
  organization?: string;
  cooperationType?: string;
  storeName?: string;
  message?: string;
  createdAt: Date;
}

// Send lead notification email
export async function sendLeadNotification(data: LeadNotificationData) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('Email transporter not configured, skipping notification');
    return false;
  }

  const settings = await getNotificationSettings();
  if (!settings || !settings.emailOnNewLead || !settings.emailRecipients) {
    console.log('Email notifications disabled or no recipients configured');
    return false;
  }

  const recipients = settings.emailRecipients
    .split(',')
    .map((email) => email.trim())
    .filter((email) => email);

  if (recipients.length === 0) {
    console.log('No valid email recipients');
    return false;
  }

  const typeLabel = leadTypeLabels[data.type] || data.type;
  const subject = `【練健康】新${typeLabel}表單 - ${data.name}`;

  // Build email content
  let content = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #2A5269; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">新${typeLabel}通知</h1>
  </div>

  <div style="padding: 20px; background: #f9f9f9;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">表單類型</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${typeLabel}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">姓名</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">電話</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.phone}</td>
      </tr>`;

  if (data.email) {
    content += `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.email}</td>
      </tr>`;
  }

  if (data.organization) {
    content += `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">公司/單位</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.organization}</td>
      </tr>`;
  }

  if (data.cooperationType) {
    content += `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">洽詢類型</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.cooperationType}</td>
      </tr>`;
  }

  if (data.storeName) {
    content += `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">選擇門店</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.storeName}</td>
      </tr>`;
  }

  if (data.message) {
    content += `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; vertical-align: top;">留言內容</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; white-space: pre-wrap;">${data.message}</td>
      </tr>`;
  }

  content += `
      <tr>
        <td style="padding: 10px; font-weight: bold;">提交時間</td>
        <td style="padding: 10px;">${data.createdAt.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}</td>
      </tr>
    </table>
  </div>

  <div style="padding: 20px; background: #2A5269; color: white; text-align: center;">
    <p style="margin: 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://l-kk.tw'}/admin/leads"
         style="color: #FB720A; text-decoration: none; font-weight: bold;">
        前往後台查看詳情 →
      </a>
    </p>
  </div>

  <div style="padding: 15px; text-align: center; color: #666; font-size: 12px;">
    此郵件由系統自動發送，請勿直接回覆。
  </div>
</div>
`;

  try {
    await transporter.sendMail({
      from: `"練健康" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: recipients.join(', '),
      subject,
      html: content,
    });
    console.log(`Lead notification email sent to: ${recipients.join(', ')}`);
    return true;
  } catch (error) {
    console.error('Failed to send lead notification email:', error);
    return false;
  }
}

// Send test notification email
export async function sendTestNotification(recipients: string[]) {
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('SMTP 設定不完整，無法發送郵件');
  }

  const subject = '【練健康】通知測試';
  const content = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #2A5269; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">通知測試成功</h1>
  </div>

  <div style="padding: 30px; background: #f9f9f9; text-align: center;">
    <p style="color: #333; font-size: 16px;">
      恭喜！您已成功設定練健康的郵件通知系統。
    </p>
    <p style="color: #666; font-size: 14px;">
      當有新的預約、加盟或合作洽詢表單提交時，<br>
      系統將自動發送通知到您設定的收件人信箱。
    </p>
  </div>

  <div style="padding: 15px; text-align: center; color: #666; font-size: 12px;">
    測試時間：${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
  </div>
</div>
`;

  await transporter.sendMail({
    from: `"練健康" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: recipients.join(', '),
    subject,
    html: content,
  });

  return true;
}
