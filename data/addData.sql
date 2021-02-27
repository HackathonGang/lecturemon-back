INSERT INTO unis (extension, name) VALUES ("warwick.ac.uk", "The University of Warwick");
INSERT INTO unis (extension, name) VALUES ("durham.ac.uk", "Durham University");

INSERT INTO lecturers (name) VALUES ("Matthew Leeke");
INSERT INTO lecturers (name) VALUES ("Michael Gale");

INSERT INTO modules (uni_id, module_code, lecturer_id) VALUES (1, "CS132", 1);
INSERT INTO modules (uni_id, module_code, lecturer_id) VALUES (1, "CS141", 2);

INSERT INTO lectures (module_id, start_date_time, end_date_time) VALUES (1, 1614686400, 1614690000);

INSERT INTO module_lookup (user_id, module_id, status) VALUES (1, 1, 0);

INSERT INTO users (first_name, last_name, uni_email, contact_email, password) VALUES ("Ben", "Dover", "Michal.Gagala@warwick.ac.uk", "michal.gagala57@gmail.com", "$2b$10$qohOTVa2Tx2j.zD5cgFYLO9wyvqARBqRDEhoO7GTxLzm7ZqCPDzG2");
