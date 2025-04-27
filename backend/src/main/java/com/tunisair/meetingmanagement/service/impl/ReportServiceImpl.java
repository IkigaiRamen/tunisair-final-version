package com.tunisair.meetingmanagement.service.impl;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import com.tunisair.meetingmanagement.model.Meeting;
import com.tunisair.meetingmanagement.model.User;
import com.tunisair.meetingmanagement.repository.MeetingRepository;
import com.tunisair.meetingmanagement.service.ReportService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReportServiceImpl implements ReportService {

    private MeetingRepository meetingRepository; // Inject the meeting repository

    public ReportServiceImpl(MeetingRepository meetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    @Override
    public byte[] generateMeetingReportExcel(Optional<Meeting> meetingOptional) {
        Meeting meeting = meetingOptional.orElseThrow(() -> new RuntimeException("Meeting not found"));

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

            // Adding participants' names
            StringBuilder participantsList = new StringBuilder();
            for (User participant : meeting.getParticipants()) {
                if (participantsList.length() > 0) {
                    participantsList.append(", ");
                }
                participantsList.append(participant.getFullName()); // Or participant.getEmail()
            }
            dataRow.createCell(4).setCellValue(participantsList.toString());

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating Excel report", e);
        }
    }



    @Override
    public byte[] generateMeetingReportPDF(Optional<Meeting> meetingOptional) {
        Meeting meeting = meetingOptional.orElseThrow(() -> new RuntimeException("Meeting not found"));

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
            document.add(new Paragraph("Participants:"));

            // Adding participants' names
            for (User participant : meeting.getParticipants()) {
                document.add(new Paragraph(" - " + participant.getFullName())); // Or use participant.getEmail()
            }

            document.add(new Paragraph("Decisions: " + meeting.getDecisions()));

            document.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF report", e);
        }
    }

    @Override
    public byte[] generateAllMeetingsReportExcel() {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("All Meetings Report");

            // Create header row
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Title");
            header.createCell(1).setCellValue("Date");
            header.createCell(2).setCellValue("Agenda");
            header.createCell(3).setCellValue("Objective");
            header.createCell(4).setCellValue("Participants");

            // Fetch all meetings from the repository
            List<Meeting> allMeetings = meetingRepository.findAll();

            // Populate data rows for each meeting
            int rowNum = 1;
            for (Meeting meeting : allMeetings) {
                Row dataRow = sheet.createRow(rowNum++);

                dataRow.createCell(0).setCellValue(meeting.getTitle());
                dataRow.createCell(1).setCellValue(meeting.getDateTime().toString());
                dataRow.createCell(2).setCellValue(meeting.getAgenda());
                dataRow.createCell(3).setCellValue(meeting.getObjectives());

                // Adding participants' names
                StringBuilder participantsList = new StringBuilder();
                for (User participant : meeting.getParticipants()) {
                    if (participantsList.length() > 0) {
                        participantsList.append(", ");
                    }
                    participantsList.append(participant.getFullName()); // Or participant.getEmail()
                }
                dataRow.createCell(4).setCellValue(participantsList.toString());
            }

            // Write to output stream
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating Excel report for all meetings", e);
        }
    }

    @Override
    public byte[] generateAllMeetingsReportPDF() {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("All Meetings Report")
                    .setBold()
                    .setFontSize(18)
                    .setTextAlignment(TextAlignment.CENTER));

            // Fetch all meetings from the repository
            List<Meeting> allMeetings = meetingRepository.findAll();

            for (Meeting meeting : allMeetings) {
                document.add(new Paragraph("Title: " + meeting.getTitle()));
                document.add(new Paragraph("Date: " + meeting.getDateTime()));
                document.add(new Paragraph("Agenda: " + meeting.getAgenda()));
                document.add(new Paragraph("Objectives: " + meeting.getObjectives()));
                document.add(new Paragraph("Decisions: " + meeting.getDecisions()));
                document.add(new Paragraph("Participants:"));

                // Adding participants' names
                for (User participant : meeting.getParticipants()) {
                    document.add(new Paragraph(" - " + participant.getFullName())); // Or participant.getEmail()
                }

                document.add(new Paragraph("--------------------------------------------------"));
            }

            document.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF report for all meetings", e);
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
