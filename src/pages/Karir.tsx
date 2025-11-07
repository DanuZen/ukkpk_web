import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock } from "lucide-react";

const jobs = [
  {
    title: "Content Creator",
    company: "Media Kampus ITB",
    location: "Bandung",
    type: "Part-time",
    description: "Mencari content creator untuk media sosial kampus",
    posted: "2 hari yang lalu",
  },
  {
    title: "Radio Announcer",
    company: "Radio Kampus",
    location: "Bandung",
    type: "Internship",
    description: "Kesempatan magang sebagai penyiar radio kampus",
    posted: "5 hari yang lalu",
  },
  {
    title: "Videographer",
    company: "Production House ITB",
    location: "Bandung",
    type: "Freelance",
    description: "Dibutuhkan videographer untuk project kampus",
    posted: "1 minggu yang lalu",
  },
  {
    title: "Graphic Designer",
    company: "Tim Kreatif UKKPK",
    location: "Bandung",
    type: "Part-time",
    description: "Membuat desain untuk konten media kampus",
    posted: "3 hari yang lalu",
  },
];

const Karir = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Peluang Karir
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Temukan peluang karir dan magang di bidang komunikasi dan penyiaran
          </p>
        </div>

        {/* Jobs List */}
        <div className="max-w-4xl mx-auto space-y-6">
          {jobs.map((job, index) => (
            <Card
              key={index}
              className="hover-scale border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                      <CardDescription className="text-base">
                        {job.company}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge>{job.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{job.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{job.posted}</span>
                  </div>
                </div>
                <Button className="w-full sm:w-auto">Lamar Sekarang</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ingin Posting Lowongan?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Jika Anda memiliki lowongan pekerjaan atau magang di bidang komunikasi dan penyiaran, 
            hubungi kami untuk memasang iklan lowongan.
          </p>
          <Button size="lg">Hubungi Kami</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Karir;
