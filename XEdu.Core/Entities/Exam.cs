using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using XEdu.Core.Enums;

namespace XEdu.Core.Entities;

[Table("exams")]
public class Exam
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("title")]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    [Column("description")]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Column("duration")]
    public int Duration { get; set; } // in minutes

    [Required]
    [Column("total_questions")]
    public int TotalQuestions { get; set; }

    [Required]
    [Column("passing_score",TypeName = "decimal(3,2)")]
    public decimal PassingScore { get; set; } = 0.6m;

    [Required]
    [Column("shuffle_questions")]
    public bool ShuffleQuestions { get; set; } = true;

    [Required]
    [Column("shuffle_answers")]
    public bool ShuffleAnswers { get; set; } = true;

    [Required]
    [Column("show_correct_answers")]
    public bool ShowCorrectAnswers { get; set; } = true;

    [Required]
    [Column("show_results_immediately")]
    public bool ShowResultsImmediately { get; set; } = true;

    [Required]
    [Column("allow_retake")]
    public bool AllowRetake { get; set; } = false;

    [Required]
    [Column("max_attempts")]
    public int MaxAttempts { get; set; } = 1;

    [Required]
    [Column("teacher_id")]
    public long? TeacherId { get; set; }

    [Column("course_id")]
    public long? CourseId { get; set; }

    [Required]
    [Column("subject_id")]
    public long? SubjectId { get; set; }

    [Required]
    [Column("grade_id")]
    public long? GradeId { get; set; }
    
    [Required]
    [Column("topic_id")]
    public long? TopicId { get; set; }

    [Required]
    [Column("status",TypeName = "varchar(50)")]
    public ExamStatus Status { get; set; } = ExamStatus.DRAFT;

    [Column("start_time")]
    public DateTime? StartTime { get; set; }

    [Column("end_time")]
    public DateTime? EndTime { get; set; }

    [Required]
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(TeacherId))]
    public virtual User Teacher { get; set; } = null!;

    [ForeignKey(nameof(CourseId))]
    public virtual Course? Course { get; set; }

    [ForeignKey(nameof(SubjectId))]
    public virtual Subject Subject { get; set; } = null!;

    [ForeignKey(nameof(GradeId))]
    public virtual Grade Grade { get; set; } = null!;
    
    [ForeignKey(nameof(TopicId))]
    public virtual Topic Topic { get; set; } = null!;

    public virtual ICollection<ExamQuestion> ExamQuestions { get; set; } = new List<ExamQuestion>();
    public virtual ICollection<StudentExam> StudentExams { get; set; } = new List<StudentExam>();
    public virtual ICollection<ClassroomExam> ClassroomExams { get; set; } = new List<ClassroomExam>();
}