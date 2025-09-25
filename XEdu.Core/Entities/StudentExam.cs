using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using XEdu.Core.Enums;

namespace XEdu.Core.Entities;

[Table("student_exams")]
public class StudentExam
{
    public StudentExam(string? questionOrder)
    {
        QuestionOrder = questionOrder;
    }

    public StudentExam(long questionOrder, long examId)
    {
        QuestionOrder = questionOrder.ToString();
        ExamId = examId;
    }

    public StudentExam()
    {
        
    }

    [Key]
    [Column("id")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    [Required]
    [Column("student_id")]
    public long StudentId { get; set; }

    [Required]
    [Column("exam_id")]
    public long ExamId { get; set; }

    [Required]
    [Column("attempt_number")]
    public int AttemptNumber { get; set; } = 1;

    [Required]
    [Column("status")]
    public ExamAttemptStatus Status { get; set; } = ExamAttemptStatus.IN_PROGRESS;

    [Required]
    [Column("started_at")]
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;

    
    [Column("submitted_at")]
    public DateTime? SubmittedAt { get; set; }

    [Column("score",TypeName = "decimal(5,2)")]
    public decimal? Score { get; set; }

    [Column("passed")] public bool? Passed { get; set; } = false;

    [Column("question_order",TypeName = "text")]
    public string? QuestionOrder { get; set; } // JSON array of question IDs in randomized order
    
    [Required]
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    [ForeignKey(nameof(StudentId))]
    public virtual User Student { get; set; } = null!;

    [ForeignKey(nameof(ExamId))]
    public virtual Exam Exam { get; set; } = null!;

    public virtual ICollection<StudentAnswer> StudentAnswers { get; set; } = new List<StudentAnswer>();
}