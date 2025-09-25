using AutoMapper;
using XEdu.Core.DTOs.request.Chapter;
using XEdu.Core.DTOs.request.Classroom;
using XEdu.Core.DTOs.request.Course;
using XEdu.Core.DTOs.request.CourseEnroll;
using XEdu.Core.DTOs.request.Exam;
using XEdu.Core.DTOs.request.Lesson;
using XEdu.Core.DTOs.request.User;
using XEdu.Core.DTOs.response.Answer;
using XEdu.Core.DTOs.response.Chapter;
using XEdu.Core.DTOs.response.Classroom;
using XEdu.Core.DTOs.response.ClassStudent;
using XEdu.Core.DTOs.response.Course;
using XEdu.Core.DTOs.response.CourseEnrollment;
using XEdu.Core.DTOs.response.EnrollmentLesson;
using XEdu.Core.DTOs.response.Exam;
using XEdu.Core.DTOs.response.Grade;
using XEdu.Core.DTOs.response.Lesson;
using XEdu.Core.DTOs.response.Subject;
using XEdu.Core.DTOs.response.User;
using XEdu.Core.Entities;

namespace XEdu.Api.Config;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        //Subject Mappings
        CreateMap<Subject, SubjectResponse>();

        //User Mappings
        CreateMap<User, UserProfileResponse>();
        CreateMap<User, UserInfoLogin>();
        CreateMap<User, UserProfileByAdmin>();
        CreateMap<UpdateProfileRequest, User>();

        //Classroom Mappings
        CreateMap<Classroom, ClassroomByIdResponse>();
        CreateMap<CreateClass, Classroom>();

        //Grade Mappings
        CreateMap<Grade, GradeResponse>();

        //Course Mappings
        CreateMap<Course, CourseResponse>();
        CreateMap<CreateCourse, Course>();
        CreateMap<UpdateCourse, Course>();
        CreateMap<PublishCourse, Course>();

        //Lesson Mappings
        CreateMap<CreateLesson, Lesson>();

        //Exam Mappings
        CreateMap<CreateExam, Exam>();
        CreateMap<Exam, ExamResponse>()
            .ForMember(dest=>dest.fullName, opt => opt.MapFrom(src => src.Teacher.FullName ?? "Unknown"));

        //ClassStudent Mappings
        CreateMap<AddStudent, ClassroomStudent>();
        CreateMap<ClassroomStudent, ClassStudent>()
            .ForMember(dest => dest.classId, opt => opt.MapFrom(src => src.ClassroomId))
            .ForMember(dest => dest.studentId, opt => opt.MapFrom(src => src.StudentId))
            .ForMember(dest => dest.studentName, opt => opt.MapFrom(src => src.Student.FullName ?? "Unknown"))
            .ForMember(dest => dest.studentEmail, opt => opt.MapFrom(src => src.Student.Email))
            .ForMember(dest => dest.role, opt => opt.MapFrom(src => src.Role))
            .ForMember(dest => dest.joinedAt, opt => opt.MapFrom(src => src.JoinedAt));

        // ExamStudent Mappings
        CreateMap<StudentExam, StartExamRequest>()
            .ForMember(dest => dest.id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.examId, opt => opt.MapFrom(src => src.ExamId))
            .ForMember(dest => dest.examTitle, opt => opt.MapFrom(src => src.Exam != null ? src.Exam.Title : ""))
            .ForMember(dest => dest.duration, opt => opt.MapFrom(src => src.Exam != null ? src.Exam.Duration : 0))
            .ForMember(dest => dest.totalQuestions,opt => opt.MapFrom(src => src.Exam != null ? src.Exam.TotalQuestions : 0))
            .ForMember(dest => dest.attemptNumber, opt => opt.MapFrom(src => src.AttemptNumber))
            .ForMember(dest => dest.startedAt, opt => opt.MapFrom(src => src.StartedAt))
            .ForMember(dest => dest.status, opt => opt.MapFrom(src => src.Status.ToString()));

        // Mapping cho Question -> ExamQuestionResponse (tùy chọn)
        CreateMap<Question, ExamQuestionResponse>()
            .ForMember(dest => dest.questionId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.questionText, opt => opt.MapFrom(src => src.QuestionText))
            .ForMember(dest => dest.questionType, opt => opt.MapFrom(src => src.Type))
            .ForMember(dest => dest.points, opt => opt.MapFrom(src => src.Points))
            .ForMember(dest => dest.answers, opt => opt.Ignore()); // Sẽ map riêng

        CreateMap<Answer, AnswerResponse>()
            .ForMember(dest => dest.answerId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.answerText, opt => opt.MapFrom(src => src.AnswerText));

        CreateMap<StudentExam, ExamResultResponse>();

        //Chapter Mappings
        CreateMap<CreateChapter, Chapter>();
        CreateMap<Chapter, ChapterResponse>();
        CreateMap<UpdateChapterRequest, Chapter>();

        //Lesson Mappings
        CreateMap<Lesson, LessonResponse>();
        CreateMap<Lesson, LessonDetails>()
            .ForMember(dest => dest.title, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.type, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.videoUrl, opt => opt.MapFrom(src => src.VideoUrl))
            .ForMember(dest => dest.content, opt => opt.MapFrom(src => src.Content))
            .ForMember(dest => dest.attachmentUrl, opt => opt.MapFrom(src => src.AttachmentUrl))
            .ForMember(dest => dest.externalLink, opt => opt.MapFrom(src => src.ExternalLink))
            .ForMember(dest => dest.chapterId, opt => opt.MapFrom(src => src.ChapterId));
        
        //CourseEnrollment Mappings
        CreateMap<AddCourseEnroll, CourseEnrollment>();
        CreateMap<CourseEnrollment, CourseByStudentId>()
            .ForMember(dest => dest.id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.studentId, opt => opt.MapFrom(src => src.StudentId))
            .ForMember(dest => dest.courseId, opt => opt.MapFrom(src => src.CourseId))
            .ForMember(dest => dest.teacherId, opt => opt.MapFrom(src => src.Course.Teacher.FullName))
            .ForMember(dest => dest.courseName, opt => opt.MapFrom(src => src.Course.Title))
            .ForMember(dest => dest.courseDescription, opt => opt.MapFrom(src => src.Course.Description))
            .ForMember(dest => dest.courseLevel, opt => opt.MapFrom(src => src.Course.Level))
            .ForMember(dest => dest.courseImage, opt => opt.MapFrom(src => src.Course.Thumbnail))
            .ForMember(dest => dest.type, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.progress, opt => opt.MapFrom(src => src.Progress))
            .ForMember(dest => dest.enrolledAt, opt=> opt.MapFrom(src  => src.EnrolledAt))
            .ForMember(dest => dest.lessonCompleted, opt => opt.MapFrom(src => src.LessonsCompleted));
    
        //EnrollmentLesson Mappings
        CreateMap<EnrollmentLesson, CompleteLesson>();
    }
}