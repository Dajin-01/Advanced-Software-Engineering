package com.learning.gym_management.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.mail.*;
import javax.mail.internet.*;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Properties;

/**
 * @Author: Chen Xingjian
 * @CreateDate: 2025-06-10 13:30:06
 * @Version: 1.0.0
 * @Description:
 **/
@Slf4j
@Component
public class EmailUtil {

    // 必填项：你的 Gmail 账号 和 App 密码
    private static final String USERNAME = "chenxingjian.14905947@gmail.com";
    private static final String PASSWORD = "echkofnuisdvcngp";

    private static Session createSession() {
        Properties props = new Properties();
        props.put("mail.smtp.auth", true);
        props.put("mail.smtp.starttls.enable", true);
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        return Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(USERNAME, PASSWORD);
            }
        });
    }

    public static void sendPlainTextEmail(List<String> to, String subject, String content) throws MessagingException, IOException {
        sendEmail(to, null, null, subject, content, false, null);
    }

    public static void sendHtmlEmail(List<String> to, String subject, String htmlContent) throws MessagingException, IOException {
        sendEmail(to, null, null, subject, htmlContent, true, null);
    }

    public static void sendEmailWithAttachment(List<String> to, String subject, String content, File attachment) throws MessagingException, IOException {
        sendEmail(to, null, null, subject, content, true, attachment);
    }

    public static void sendEmail(
            List<String> to,
            List<String> cc,
            List<String> bcc,
            String subject,
            String content,
            boolean isHtml,
            File attachment
    ) throws MessagingException, IOException {

        Session session = createSession();

        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(USERNAME));

        if (to != null) {
            for (String recipient : to) {
                message.addRecipient(Message.RecipientType.TO, new InternetAddress(recipient));
            }
        }
        if (cc != null) {
            for (String recipient : cc) {
                message.addRecipient(Message.RecipientType.CC, new InternetAddress(recipient));
            }
        }
        if (bcc != null) {
            for (String recipient : bcc) {
                message.addRecipient(Message.RecipientType.BCC, new InternetAddress(recipient));
            }
        }

        message.setSubject(subject);

        if (attachment != null) {
            MimeBodyPart bodyPart = new MimeBodyPart();
            if (isHtml) {
                bodyPart.setContent(content, "text/html;charset=UTF-8");
            } else {
                bodyPart.setText(content);
            }

            MimeBodyPart attachPart = new MimeBodyPart();
            attachPart.attachFile(attachment);

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(bodyPart);
            multipart.addBodyPart(attachPart);

            message.setContent(multipart);
        } else {
            if (isHtml) {
                message.setContent(content, "text/html;charset=UTF-8");
            } else {
                message.setText(content);
            }
        }

        Transport.send(message);
        System.out.println("✅ 邮件已成功发送到：" + to);
    }
}
