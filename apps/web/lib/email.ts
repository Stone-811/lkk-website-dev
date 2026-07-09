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

// ==========================================
// 模組化表單確認信系統
// ==========================================

// 表單類型設定
const formConfirmationConfig: Record<string, {
  subject: string;
  title: string;
  greeting: string;
  message: string;
  closing: string;
}> = {
  booking: {
    subject: '【練健康】感謝您的預約',
    title: '預約確認',
    greeting: '感謝您預約練健康的體驗課程！',
    message: '我們已收到您的預約申請，將盡快與您聯繫確認時間。',
    closing: '如有任何問題，歡迎直接回覆此信或致電門店。<br>我們期待與您見面！',
  },
  cooperation: {
    subject: '【練健康】感謝您的合作洽詢',
    title: '洽詢確認',
    greeting: '感謝您對練健康的關注與洽詢！',
    message: '我們已收到您的合作洽詢，專人將於 2 個工作天內與您聯繫。',
    closing: '如有緊急需求，歡迎直接來電洽詢。<br>期待與您的合作！',
  },
  franchise: {
    subject: '【練健康】感謝您的加盟洽詢',
    title: '加盟洽詢確認',
    greeting: '感謝您對練健康加盟的興趣！',
    message: '我們已收到您的加盟洽詢，加盟專員將於 3 個工作天內與您聯繫，提供詳細的加盟說明。',
    closing: '如有任何問題，歡迎直接回覆此信。<br>期待與您攜手共創健康事業！',
  },
};

// 通用表單確認信介面
interface FormConfirmationData {
  type: 'booking' | 'cooperation' | 'franchise';
  name: string;
  email: string;
  details?: Array<{ label: string; value: string }>;
}

// 發送表單確認信給填單人（通用模組）
export async function sendFormConfirmation(data: FormConfirmationData) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('Email transporter not configured, skipping confirmation');
    return false;
  }

  const config = formConfirmationConfig[data.type];
  if (!config) {
    console.error(`Unknown form type: ${data.type}`);
    return false;
  }

  // 建立詳細資訊區塊
  let detailsHtml = '';
  if (data.details && data.details.length > 0) {
    detailsHtml = `
    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #ddd;">
      ${data.details.map(d => `<p style="margin: 0 0 10px 0; color: #666;"><strong>${d.label}：</strong>${d.value}</p>`).join('')}
    </div>`;
  }

  const content = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #2A5269; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">${config.title}</h1>
  </div>

  <div style="padding: 30px; background: #f9f9f9;">
    <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
      ${data.name} 您好，
    </p>
    <p style="color: #333; font-size: 16px; line-height: 1.8;">
      ${config.greeting}<br>
      ${config.message}
    </p>
    ${detailsHtml}
    <p style="color: #666; font-size: 14px; line-height: 1.6;">
      ${config.closing}
    </p>
  </div>

  <div style="padding: 20px; background: #2A5269; color: white; text-align: center;">
    <p style="margin: 0; font-size: 14px;">
      練健康｜中高齡肌力訓練專家
    </p>
    <p style="margin: 10px 0 0 0;">
      <a href="https://l-kk.tw" style="color: #FB720A; text-decoration: none;">
        l-kk.tw
      </a>
    </p>
  </div>
</div>
`;

  try {
    await transporter.sendMail({
      from: `"練健康" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: data.email,
      subject: config.subject,
      html: content,
    });
    console.log(`[${data.type}] Confirmation sent to: ${data.email}`);
    return true;
  } catch (error) {
    console.error(`Failed to send ${data.type} confirmation:`, error);
    return false;
  }
}

// ==========================================
// 舊版相容：預約確認信（呼叫通用模組）
// ==========================================
export async function sendBookingConfirmation(data: {
  name: string;
  email: string;
  storeName: string;
  preferredTime: string[];
}) {
  return sendFormConfirmation({
    type: 'booking',
    name: data.name,
    email: data.email,
    details: [
      { label: '預約門店', value: data.storeName },
      { label: '偏好時段', value: data.preferredTime.join('、') },
    ],
  });
}

// 合作洽詢確認信
export async function sendCooperationConfirmation(data: {
  name: string;
  email: string;
  organization: string;
  cooperationType: string;
}) {
  return sendFormConfirmation({
    type: 'cooperation',
    name: data.name,
    email: data.email,
    details: [
      { label: '公司/單位', value: data.organization },
      { label: '洽詢類型', value: data.cooperationType },
    ],
  });
}

// 加盟洽詢確認信
export async function sendFranchiseConfirmation(data: {
  name: string;
  email: string;
  region?: string;
  investmentBudget?: string;
}) {
  const details: Array<{ label: string; value: string }> = [];
  if (data.region) details.push({ label: '有興趣地區', value: data.region });
  if (data.investmentBudget) details.push({ label: '投資預算', value: data.investmentBudget });

  return sendFormConfirmation({
    type: 'franchise',
    name: data.name,
    email: data.email,
    details: details.length > 0 ? details : undefined,
  });
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
