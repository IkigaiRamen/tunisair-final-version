package com.tunisair.meetingmanagement.service.impl;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.service.ReportService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ReportServiceImpl implements ReportService {


    @Override
    public byte[] generateMeetingReportExcel(Optional<Meeting> meeting) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Meeting Report");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Title");
            header.createCell(1).setCellValue("Date");
            header.createCell(2).setCellValue("Agenda");
            header.createCell(3).setCellValue("Objective");
            header.createCell(4).setCellValue("Participants");

            Row dataRow = sheet.createRow(1);
            dataRow.createCell(0).setCellValue(meeting.getTitle());
            dataRow.createCell(1).setCellValue(meeting.getDateTime().toString());
            dataRow.createCell(2).setCellValue(meeting.getAgenda());
            dataRow.createCell(3).setCellValue(meeting.getObjectives());
            dataRow.createCell(4).setCellValue(meeting.getParticipants().toString());

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating Excel report", e);
        }
    }

    @Override
    public byte[] generateMeetingReportPDF(Optional<Meeting> meeting) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("Meeting Report")
                    .setBold()
                    .setFontSize(18)
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph("Title: " + meeting.getTitle()));
            document.add(new Paragraph("Date: " + meeting.getDateTime()));
            document.add(new Paragraph("Agenda: " + meeting.getAgenda()));
            document.add(new Paragraph("Objectives: " + meeting.getObjectives()));
            document.add(new Paragraph("Objectives: " + meeting.getParticipants()));
            document.add(new Paragraph("decisions: " + meeting.getDecisions()));


            document.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF report", e);
        }
    }


    @Override
    public byte[] generateUserActivityReport(User user, LocalDateTime start, LocalDateTime end) {
        return new byte[0];
    }

    @Override
    public byte[] generateTaskCompletionReport(LocalDateTime start, LocalDateTime end) {
        return new byte[0];
    }

    @Override
    public byte[] generateDecisionImplementationReport(LocalDateTime start, LocalDateTime end) {
        return new byte[0];
    }

    @Override
    public byte[] generateMeetingAttendanceReport(Meeting meeting) {
        return new byte[0];
    }

    @Override
    public byte[] generateTaskAssignmentReport(User user) {
        return new byte[0];
    }

    @Override
    public byte[] generateDecisionDeadlineReport(LocalDateTime start, LocalDateTime end) {
        return new byte[0];
    }
}
