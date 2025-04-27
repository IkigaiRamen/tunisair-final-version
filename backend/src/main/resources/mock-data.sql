-- Keep existing users, just add new ones
INSERT INTO `users` (`email`, `enabled`, `full_name`, `password`) VALUES
('sarah.manager@tunisair.com', 1, 'Sarah Manager', '$2a$10$8XrMBCGQaOIJW3e3wxwU9ucgEdjrwlIfPFxAtBEmASoU4MU6tYGNq'),
('mohamed.tech@tunisair.com', 1, 'Mohamed Tech', '$2a$10$8XrMBCGQaOIJW3e3wxwU9ucgEdjrwlIfPFxAtBEmASoU4MU6tYGNq'),
('leila.finance@tunisair.com', 1, 'Leila Finance', '$2a$10$8XrMBCGQaOIJW3e3wxwU9ucgEdjrwlIfPFxAtBEmASoU4MU6tYGNq'),
('karim.operations@tunisair.com', 1, 'Karim Operations', '$2a$10$8XrMBCGQaOIJW3e3wxwU9ucgEdjrwlIfPFxAtBEmASoU4MU6tYGNq'),
('fatma.hr@tunisair.com', 1, 'Fatma HR', '$2a$10$8XrMBCGQaOIJW3e3wxwU9ucgEdjrwlIfPFxAtBEmASoU4MU6tYGNq'),
('ali.maintenance@tunisair.com', 1, 'Ali Maintenance', '$2a$10$8XrMBCGQaOIJW3e3wxwU9ucgEdjrwlIfPFxAtBEmASoU4MU6tYGNq');

-- Assign roles to new users (assuming your existing roles are: 1=ADMIN, 2=MANAGER, 3=USER)
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
((SELECT id FROM users WHERE email = 'sarah.manager@tunisair.com'), 2),
((SELECT id FROM users WHERE email = 'mohamed.tech@tunisair.com'), 3),
((SELECT id FROM users WHERE email = 'leila.finance@tunisair.com'), 2),
((SELECT id FROM users WHERE email = 'karim.operations@tunisair.com'), 3),
((SELECT id FROM users WHERE email = 'fatma.hr@tunisair.com'), 2),
((SELECT id FROM users WHERE email = 'ali.maintenance@tunisair.com'), 3);

-- Insert meetings with realistic Tunisair context
INSERT INTO `meetings` (`agenda`, `created_at`, `date_time`, `objectives`, `title`, `updated_at`, `created_by_id`) VALUES
('1. Route Optimization Review\n2. Fuel Efficiency Analysis\n3. Schedule Adjustments', NOW(), '2024-03-20 09:00:00', 'Optimize flight routes and improve operational efficiency', 'Operations Optimization Meeting', NOW(), (SELECT id FROM users WHERE email = 'sarah.manager@tunisair.com')),
('1. Aircraft Maintenance Schedule\n2. Safety Compliance\n3. Technical Updates', NOW(), '2024-03-22 14:00:00', 'Review maintenance protocols and safety standards', 'Maintenance & Safety Review', NOW(), (SELECT id FROM users WHERE email = 'fatma.hr@tunisair.com')),
('1. Customer Service Enhancement\n2. Passenger Experience\n3. Service Quality Metrics', NOW(), '2024-03-25 10:00:00', 'Improve passenger satisfaction and service quality', 'Service Quality Enhancement', NOW(), (SELECT id FROM users WHERE email = 'leila.finance@tunisair.com')),
('1. HR Policies Update\n2. Staff Training Programs\n3. Performance Reviews', NOW(), '2024-03-28 11:00:00', 'Update HR policies and plan training initiatives', 'HR Strategic Planning', NOW(), (SELECT id FROM users WHERE email = 'fatma.hr@tunisair.com'));

-- Add participants to meetings
INSERT INTO `meeting_participants` (`meeting_id`, `user_id`)
SELECT m.id, u.id
FROM meetings m
CROSS JOIN users u
WHERE m.created_by_id != u.id
AND u.id IN (
    SELECT id FROM users WHERE email IN 
    ('sarah.manager@tunisair.com', 'mohamed.tech@tunisair.com', 'leila.finance@tunisair.com', 
     'karim.operations@tunisair.com', 'fatma.hr@tunisair.com', 'ali.maintenance@tunisair.com')
)
LIMIT 20;

-- Insert documents
INSERT INTO `documents` (`created_at`, `description`, `name`, `path`, `size`, `type`, `updated_at`, `version`, `meeting_id`, `uploaded_by_id`) VALUES
(NOW(), 'Comprehensive analysis of current route efficiency and recommendations', 'Route_Optimization_Analysis.pdf', '/uploads/Route_Optimization_Analysis.pdf', 2048576, 'application/pdf', NOW(), 1, 
(SELECT id FROM meetings WHERE title = 'Operations Optimization Meeting'), 
(SELECT id FROM users WHERE email = 'sarah.manager@tunisair.com')),

(NOW(), 'Updated aircraft maintenance schedules and safety protocols', 'Maintenance_Safety_Protocols_2024.docx', '/uploads/Maintenance_Safety_Protocols_2024.docx', 1048576, 'application/msword', NOW(), 1,
(SELECT id FROM meetings WHERE title = 'Maintenance & Safety Review'),
(SELECT id FROM users WHERE email = 'ali.maintenance@tunisair.com')),

(NOW(), 'Customer satisfaction survey results and analysis', 'Customer_Service_Analysis_2024.pptx', '/uploads/Customer_Service_Analysis_2024.pptx', 3145728, 'application/vnd.openxmlformats-officedocument.presentationml.presentation', NOW(), 1,
(SELECT id FROM meetings WHERE title = 'Service Quality Enhancement'),
(SELECT id FROM users WHERE email = 'leila.finance@tunisair.com')),

(NOW(), 'Updated HR policies and training program details', 'HR_Policies_2024.pdf', '/uploads/HR_Policies_2024.pdf', 1548576, 'application/pdf', NOW(), 1,
(SELECT id FROM meetings WHERE title = 'HR Strategic Planning'),
(SELECT id FROM users WHERE email = 'fatma.hr@tunisair.com'));

-- Insert decisions
INSERT INTO `decisions` (`content`, `created_at`, `deadline`, `updated_at`, `meeting_id`, `responsible_user_id`) VALUES
('Implement new fuel-efficient routes for summer schedule', NOW(), '2024-04-15 17:00:00', NOW(),
(SELECT id FROM meetings WHERE title = 'Operations Optimization Meeting'),
(SELECT id FROM users WHERE email = 'sarah.manager@tunisair.com')),

('Update maintenance schedule to improve aircraft turnaround time', NOW(), '2024-04-01 17:00:00', NOW(),
(SELECT id FROM meetings WHERE title = 'Maintenance & Safety Review'),
(SELECT id FROM users WHERE email = 'ali.maintenance@tunisair.com')),

('Launch new passenger satisfaction program', NOW(), '2024-04-10 17:00:00', NOW(),
(SELECT id FROM meetings WHERE title = 'Service Quality Enhancement'),
(SELECT id FROM users WHERE email = 'leila.finance@tunisair.com')),

('Implement new staff training modules', NOW(), '2024-04-20 17:00:00', NOW(),
(SELECT id FROM meetings WHERE title = 'HR Strategic Planning'),
(SELECT id FROM users WHERE email = 'fatma.hr@tunisair.com'));

-- Insert tasks
INSERT INTO `tasks` (`created_at`, `deadline`, `description`, `status`, `updated_at`, `assigned_to_id`, `decision_id`) VALUES
(NOW(), '2024-04-10 17:00:00', 'Analyze and optimize flight routes for fuel efficiency', 'IN_PROGRESS', NOW(),
(SELECT id FROM users WHERE email = 'karim.operations@tunisair.com'),
(SELECT id FROM decisions WHERE content LIKE '%fuel-efficient routes%')),

(NOW(), '2024-03-25 17:00:00', 'Review and update maintenance procedures', 'PENDING', NOW(),
(SELECT id FROM users WHERE email = 'ali.maintenance@tunisair.com'),
(SELECT id FROM decisions WHERE content LIKE '%maintenance schedule%')),

(NOW(), '2024-04-05 17:00:00', 'Develop customer feedback collection system', 'PENDING', NOW(),
(SELECT id FROM users WHERE email = 'leila.finance@tunisair.com'),
(SELECT id FROM decisions WHERE content LIKE '%passenger satisfaction%')),

(NOW(), '2024-04-15 17:00:00', 'Create new training materials for staff', 'PENDING', NOW(),
(SELECT id FROM users WHERE email = 'fatma.hr@tunisair.com'),
(SELECT id FROM decisions WHERE content LIKE '%staff training%'));

-- Insert notification logs
INSERT INTO `notification_logs` (`message`, `is_read`, `sent_at`, `type`, `user_id`) VALUES
('New task assigned: Analyze and optimize flight routes', 0, NOW(), 'SYSTEM',
(SELECT id FROM users WHERE email = 'karim.operations@tunisair.com')),

('Maintenance procedure review required', 0, NOW(), 'SYSTEM',
(SELECT id FROM users WHERE email = 'ali.maintenance@tunisair.com')),

('New meeting scheduled: Service Quality Enhancement', 0, NOW(), 'EMAIL',
(SELECT id FROM users WHERE email = 'leila.finance@tunisair.com')),

('Document uploaded: HR Policies 2024', 0, NOW(), 'SYSTEM',
(SELECT id FROM users WHERE email = 'fatma.hr@tunisair.com')),

('Task deadline approaching: Customer feedback system', 0, NOW(), 'EMAIL',
(SELECT id FROM users WHERE email = 'leila.finance@tunisair.com')),

('Meeting reminder: Operations Optimization', 0, NOW(), 'SYSTEM',
(SELECT id FROM users WHERE email = 'sarah.manager@tunisair.com')); 