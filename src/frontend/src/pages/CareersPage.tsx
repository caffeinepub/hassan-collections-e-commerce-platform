import { Briefcase, Clock, MapPin } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function CareersPage() {
  const openings = [
    {
      title: "Fashion Designer",
      department: "Design",
      location: "Manila, Philippines",
      type: "Full-time",
      description:
        "We are looking for a creative fashion designer to join our design team and help create our next collection.",
    },
    {
      title: "E-commerce Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description:
        "Manage our online store operations, optimize user experience, and drive online sales growth.",
    },
    {
      title: "Customer Service Representative",
      department: "Customer Service",
      location: "Manila, Philippines",
      type: "Part-time",
      description:
        "Provide excellent customer service and support to our valued customers through various channels.",
    },
  ];

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Join Our Team
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Be part of a passionate team dedicated to bringing elegance and style
          to fashion lovers everywhere
        </p>
      </div>

      {/* Company Culture */}
      <div className="mb-16 grid gap-8 md:grid-cols-2 items-center">
        <div>
          <img
            src="/assets/generated/store-interior.dim_800x600.jpg"
            alt="Our Team"
            className="rounded-lg object-cover"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Why Work With Us?</h2>
          <p className="text-muted-foreground">
            At HASSANé Collections, we believe in fostering a creative,
            inclusive, and dynamic work environment. We value innovation,
            collaboration, and personal growth.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Competitive salary and benefits</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Professional development opportunities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Flexible work arrangements</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Employee discounts on all products</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Open Positions */}
      <div>
        <h2 className="mb-6 text-3xl font-bold">Open Positions</h2>
        <div className="space-y-4">
          {openings.map((job) => (
            <Card key={job.title}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="mb-2">{job.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        <Briefcase className="mr-1 h-3 w-3" />
                        {job.department}
                      </Badge>
                      <Badge variant="outline">
                        <MapPin className="mr-1 h-3 w-3" />
                        {job.location}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="mr-1 h-3 w-3" />
                        {job.type}
                      </Badge>
                    </div>
                  </div>
                  <Button>Apply Now</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{job.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact for Opportunities */}
      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Don't See a Position That Fits?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We're always looking for talented individuals. Send us your resume
              and we'll keep you in mind for future opportunities.
            </p>
            <Button asChild>
              <a href="/contact">Get in Touch</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
