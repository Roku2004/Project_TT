using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using XEdu.Core.Enums;

namespace XEdu.Core.Entities;

[Table("chapter")]
public class Chapter
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [MaxLength(500)]
    [Column("chapter_name")]
    public string ChapterName { get; set; }
    
    [Column("duration")]
    public int? Duration { get; set; }
    
    [Column("status")]
    public ChapterStatus Status { get; set; } = ChapterStatus.DRAFT;
    
    [Column("type")]
    public string? Type { get; set; } = "TOPIC";
    
    [Column("order_index")]
    public int? OrderIndex { get; set; }

    [Required]
    [Column("course_id")]
    public long CourseId { get; set; } = 0;
    
    [ForeignKey(nameof(CourseId))]
    public virtual Course Course { get; set; } = null!;
}