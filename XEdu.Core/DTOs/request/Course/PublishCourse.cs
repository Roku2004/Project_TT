using XEdu.Core.Enums;

namespace XEdu.Core.DTOs.request.Course;

public class PublishCourse
{
    public long id { get; set; }
    public bool published { get; set; } = true;
    public CourseStatus status { get; set; } = CourseStatus.PUBLISHED;
}