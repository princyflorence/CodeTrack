package com.codetrack.backend.service;

import com.codetrack.backend.entity.Student;
import com.codetrack.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student student) {

        Student existingStudent =
                studentRepository.findById(id).orElse(null);

        if (existingStudent != null) {

            existingStudent.setName(
                    student.getName()
            );

            existingStudent.setEmail(
                    student.getEmail()
            );

            existingStudent.setPassword(
                    student.getPassword()
            );

            existingStudent.setActive(
                    student.isActive()
            );

            return studentRepository.save(
                    existingStudent
            );
        }

        return null;
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    /*
     * =========================================
     * STUDENT LOGIN
     * =========================================
     */

    public Student loginStudent(
            String email,
            String password
    ) {

        Student student =
                studentRepository
                        .findByEmail(email)
                        .orElse(null);

        if (student == null) {
            return null;
        }

        if (!student.getPassword().equals(password)) {
            return null;
        }

        if (!student.isActive()) {
            return null;
        }

        return student;
    }
}