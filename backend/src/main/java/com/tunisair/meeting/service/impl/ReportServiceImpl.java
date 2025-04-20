package com.tunisair.meeting.service.impl;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.tunisair.meeting.models.*;
import com.tunisair.meeting.service.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    private final MeetingService meetingService;
    private final TaskService taskService;
    private final DecisionService decisionService;
    private final DocumentService documentService;
    private final MeetingMinutesService meetingMinutesService;

    @Autowired
    public ReportServiceImpl(MeetingService meetingService,
                           TaskService taskService,
                           DecisionService decisionService,
                           DocumentService documentService,
                           MeetingMinutesService meetingMinutesService) {
        this.meetingService = meetingService;
        this.taskService = taskService;
        this.decisionService = decisionService;
        this.documentService = documentService;
        this.meetingMinutesService = meetingMinutesService;
    }

    @Override
    public Resource generateMeetingReport(Meeting meeting) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Add meeting details
            document.add(new Paragraph("Meeting Report").setBold().setFontSize(20));
            document.add(new Paragraph("Title: " + meeting.getTitle()));
            document.add(new Paragraph("Date: " + meeting.getDateTime().format(DateTimeFormatter.ISO_DATE_TIME)));
            document.add(new Paragraph("Location: " + meeting.getLocation()));
            document.add(new Paragraph("Organizer: " + meeting.getOrganizer().getUsername()));
            
            // Add participants
            document.add(new Paragraph("Participants:").setBold());
            for (User participant : meeting.getParticipants()) {
                document.add(new Paragraph("- " + participant.getUsername()));
            }

            // Add agenda
            document.add(new Paragraph("Agenda:").setBold());
            document.add(new Paragraph(meeting.getAgenda()));

            document.close();
            return new ByteArrayResource(outputStream.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Error generating meeting report", e);
        }
    }

    @Override
    public Resource generateTaskReport(List<Task> tasks) {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Tasks");

            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Title", "Description", "Status", "Priority", "Due Date", "Assignee"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // Add task data
            int rowNum = 1;
            for (Task task : tasks) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(task.getTitle());
                row.createCell(1).setCellValue(task.getDescription());
                row.createCell(2).setCellValue(task.getStatus().toString());
                row.createCell(3).setCellValue(task.getPriority().toString());
                row.createCell(4).setCellValue(task.getDueDate().format(DateTimeFormatter.ISO_DATE));
                row.createCell(5).setCellValue(task.getAssignedTo().getUsername());
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return new ByteArrayResource(outputStream.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Error generating task report", e);
        }
    }

    @Override
    public Resource generateUserActivityReport(User user, LocalDateTime startDate, LocalDateTime endDate) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("User Activity Report").setBold().setFontSize(20));
            document.add(new Paragraph("User: " + user.getUsername()));
            document.add(new Paragraph("Period: " + startDate.format(DateTimeFormatter.ISO_DATE) + " to " + 
                                     endDate.format(DateTimeFormatter.ISO_DATE)));

            // Add meetings
            List<Meeting> meetings = meetingService.getMeetingsByParticipant(user);
            document.add(new Paragraph("Meetings Attended:").setBold());
            for (Meeting meeting : meetings) {
                document.add(new Paragraph("- " + meeting.getTitle() + " (" + 
                                         meeting.getDateTime().format(DateTimeFormatter.ISO_DATE) + ")"));
            }

            // Add tasks
            List<Task> tasks = taskService.getTasksByAssignee(user);
            document.add(new Paragraph("Tasks Assigned:").setBold());
            for (Task task : tasks) {
                document.add(new Paragraph("- " + task.getTitle() + " (" + task.getStatus() + ")"));
            }

            document.close();
            return new ByteArrayResource(outputStream.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Error generating user activity report", e);
        }
    }

    @Override
    public Resource generateMeetingMinutesReport(Meeting meeting) {
        MeetingMinutes minutes = meetingMinutesService.getMeetingMinutesByMeeting(meeting);
        if (minutes == null) {
            throw new RuntimeException("No meeting minutes found for this meeting");
        }

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("Meeting Minutes").setBold().setFontSize(20));
            document.add(new Paragraph("Meeting: " + meeting.getTitle()));
            document.add(new Paragraph("Date: " + meeting.getDateTime().format(DateTimeFormatter.ISO_DATE_TIME)));
            
            document.add(new Paragraph("Minutes:").setBold());
            document.add(new Paragraph(minutes.getContent()));

            document.close();
            return new ByteArrayResource(outputStream.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Error generating meeting minutes report", e);
        }
    }

    @Override
    public Resource generateDecisionReport(Meeting meeting) {
        List<Decision> decisions = decisionService.getDecisionsByMeeting(meeting);
        
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("Meeting Decisions Report").setBold().setFontSize(20));
            document.add(new Paragraph("Meeting: " + meeting.getTitle()));
            document.add(new Paragraph("Date: " + meeting.getDateTime().format(DateTimeFormatter.ISO_DATE_TIME)));

            document.add(new Paragraph("Decisions:").setBold());
            for (Decision decision : decisions) {
                document.add(new Paragraph("- " + decision.getDescription()));
                document.add(new Paragraph("  Proposed by: " + decision.getProposedBy().getUsername()));
                document.add(new Paragraph("  Status: " + (decision.isCompleted() ? "Completed" : "Pending")));
            }

            document.close();
            return new ByteArrayResource(outputStream.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Error generating decision report", e);
        }
    }

    @Override
    public Resource generateDocumentReport(Meeting meeting) {
        List<Document> documents = documentService.getDocumentsByMeeting(meeting);
        
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("Meeting Documents Report").setBold().setFontSize(20));
            document.add(new Paragraph("Meeting: " + meeting.getTitle()));
            document.add(new Paragraph("Date: " + meeting.getDateTime().format(DateTimeFormatter.ISO_DATE_TIME)));

            document.add(new Paragraph("Documents:").setBold());
            for (Document doc : documents) {
                document.add(new Paragraph("- " + doc.getFileName()));
                document.add(new Paragraph("  Type: " + doc.getFileType()));
                document.add(new Paragraph("  Uploaded by: " + doc.getUploadedBy().getUsername()));
                document.add(new Paragraph("  Upload date: " + doc.getUploadedAt().format(DateTimeFormatter.ISO_DATE_TIME)));
            }

            document.close();
            return new ByteArrayResource(outputStream.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Error generating document report", e);
        }
    }

    @Override
    public Resource generateCombinedReport(Meeting meeting) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("Meeting Summary Report").setBold().setFontSize(20));
            document.add(new Paragraph("Meeting: " + meeting.getTitle()));
            document.add(new Paragraph("Date: " + meeting.getDateTime().format(DateTimeFormatter.ISO_DATE_TIME)));
            document.add(new Paragraph("Location: " + meeting.getLocation()));
            document.add(new Paragraph("Organizer: " + meeting.getOrganizer().getUsername()));

            // Add meeting minutes
            MeetingMinutes minutes = meetingMinutesService.getMeetingMinutesByMeeting(meeting);
            if (minutes != null) {
                document.add(new Paragraph("Meeting Minutes:").setBold());
                document.add(new Paragraph(minutes.getContent()));
            }

            // Add decisions
            List<Decision> decisions = decisionService.getDecisionsByMeeting(meeting);
            document.add(new Paragraph("Decisions:").setBold());
            for (Decision decision : decisions) {
                document.add(new Paragraph("- " + decision.getDescription()));
            }

            // Add tasks
            List<Task> tasks = taskService.getTasksByMeeting(meeting.getId());
            document.add(new Paragraph("Tasks:").setBold());
            for (Task task : tasks) {
                document.add(new Paragraph("- " + task.getTitle() + " (" + task.getStatus() + ")"));
            }

            // Add documents
            List<Document> documents = documentService.getDocumentsByMeeting(meeting);
            document.add(new Paragraph("Documents:").setBold());
            for (Document doc : documents) {
                document.add(new Paragraph("- " + doc.getFileName()));
            }

            document.close();
            return new ByteArrayResource(outputStream.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Error generating combined report", e);
        }
    }
} 