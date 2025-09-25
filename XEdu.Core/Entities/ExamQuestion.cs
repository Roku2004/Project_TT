using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XEdu.Core.Entities;

[Table("exam_questions")]
public class ExamQuestion
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [Column("exam_id")]
    public long ExamId { get; set; }

    [Required]
    [Column("question_id")]
    public long QuestionId { get; set; }

    [Required]
    [Column("order_index")]
    public int OrderIndex { get; set; } = 0;

    [Required]
    [Column("points",TypeName = "decimal(4,2)")]
    public decimal Points { get; set; } = 1.0m;

    [Required]
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(ExamId))]
    public virtual Exam Exam { get; set; } = null!;

    [ForeignKey(nameof(QuestionId))]
    public virtual Question Question { get; set; } = null!;
}