export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            About HASSANé Collections
          </h1>
          <p className="text-lg text-muted-foreground">
            Where elegance meets contemporary design
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <img
            src="/assets/generated/store-interior.dim_800x600.jpg"
            alt="HASSANé Collections Store"
            className="rounded-lg object-cover"
          />
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Our Story</h2>
            <p className="text-muted-foreground">
              HASSANé Collections was founded with a singular vision: to create
              fashion that transcends trends and celebrates timeless elegance.
              Our journey began with a passion for quality craftsmanship and an
              unwavering commitment to excellence.
            </p>
            <p className="text-muted-foreground">
              Every piece in our collection is carefully curated to reflect the
              sophistication and individuality of the modern fashion enthusiast.
              We believe that clothing is more than just fabric—it's an
              expression of identity, confidence, and style.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground">
            At HASSANé Collections, our mission is to empower individuals
            through fashion. We strive to provide premium quality pieces that
            inspire confidence and celebrate personal style. Our commitment
            extends beyond aesthetics—we're dedicated to sustainable practices,
            ethical sourcing, and creating lasting value for our customers.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Quality</h3>
              <p className="text-sm text-muted-foreground">
                We never compromise on the quality of our materials and
                craftsmanship. Every piece is made to last.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Elegance</h3>
              <p className="text-sm text-muted-foreground">
                Timeless design that transcends fleeting trends. Our collections
                embody sophistication and grace.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Sustainability</h3>
              <p className="text-sm text-muted-foreground">
                We're committed to ethical practices and sustainable fashion
                that respects both people and planet.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted/30 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Join Our Journey</h2>
          <p className="mb-6 text-muted-foreground">
            Experience the HASSANé Collections difference. Discover fashion that
            speaks to your unique style and values.
          </p>
        </div>
      </div>
    </div>
  );
}
