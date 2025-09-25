using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using XEdu.Core.Enums;

namespace XEdu.Core.Entities;

[Table("lessons")]
public class Lesson
{
    [Key]
    [Column("id")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("title")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    [Column("description")]
    public string? Description { get; set; }

    [Required]
    [Column("type")]
    public LessonType Type { get; set; } = LessonType.VIDEO;

    [MaxLength(500)]
    [Column("video_url")]
    public string? VideoUrl { get; set; }

    [Column("content",TypeName = "text")]
    public string? Content { get; set; }

    [Column("duration")]
    public int? Duration { get; set; } // in minutes

    [Required]
    [Column("order_index")]
    public int OrderIndex { get; set; } = 0; // dùng để sắp xếp các bài học trong khóa học theo thứ tự

    [Required]
    [Column("published")]
    public bool Published { get; set; } = false;

    [Required]
    [Column("chapter_id")]
    public long ChapterId { get; set; }
    
    [Column("attachment_url")]
    public string? AttachmentUrl { get; set; }
    
    [Column("external_link")]
    public string? ExternalLink { get; set; }
    
    [Column("is_free")]
    public bool IsFree { get; set; } = false;

    [Required]
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(ChapterId))]
    public virtual Chapter Chapter { get; set; } = null!;
}