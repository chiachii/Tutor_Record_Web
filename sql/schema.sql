CREATE DATABASE wanted COLLATE utf8mb4_general_ci;

USE wanted;

-- 所有使用者
CREATE TABLE users(
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(255) NOT NULL,
    age INT(4) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 學歷資訊
CREATE TABLE schule_profile(
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT(11) NOT NULL,
    grading ENUM("Elementry", "Junior", "Senior", "University", "Master", "PhD", "Citizen") NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    CONSTRAINT fk_userid FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- 我是老師
CREATE TABLE teacher(
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT(11) NOT NULL,
    professional ENUM("數學科", "自然科", "國文科", "英文科", "理化科", "資訊科") NOT NULL,
    CONSTRAINT fk_teacher_userid FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 我是學生
CREATE TABLE student(
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT(11) NOT NULL,
    current_grading_level int(5) NOT NULL,
    CONSTRAINT fk_student_userid FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- 訂單資料
CREATE TABLE orders (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    student_user_id INT(11) NOT NULL,
    teacher_user_id INT(11) NOT NULL,
    expire DATETIME NOT NULL DEFAULT (DATE_ADD(NOW(), INTERVAL 14 DAY)), -- 系統幫你自動加至多 2 周
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    CONSTRAINT fk_order_stu_userid FOREIGN KEY (student_user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT fk_order_tea_userid FOREIGN KEY (teacher_user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- 申請資料
CREATE TABLE applicantation (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    teacher_user_id INT(11) NOT NULL,
    description TEXT NOT NULL,
    contact_method TEXT NOT NULL,
    CONSTRAINT fk_app_tea_userid FOREIGN KEY (teacher_user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT fk_apporderid FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
);

-- 上課資料
CREATE TABLE class_record (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    
    class_fill_at DATETIME NOT NULL,
    order_id BIGINT NOT NULL,

    teacher_comment TEXT,
    student_comment TEXT,

    teacher_class_note TEXT,
    student_class_note TEXT,

    teacher_rating INT(5),
    student_rating INT(5), 

    CONSTRAINT fk_orderid FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);