import { Search } from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          q: "How long does shipping take?",
          a: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days delivery.",
        },
        {
          q: "Do you offer free shipping?",
          a: "Yes! We offer free standard shipping on all orders over ₱2,000.",
        },
        {
          q: "Can I track my order?",
          a: "Yes, once your order ships, you will receive a tracking number via email.",
        },
      ],
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          q: "What is your return policy?",
          a: "We accept returns within 30 days of purchase. Items must be unworn, unwashed, and in original packaging with tags attached.",
        },
        {
          q: "How do I initiate a return?",
          a: "Contact our customer service team through the contact form or email us at returns@hassane-collections.com.",
        },
        {
          q: "Do you offer exchanges?",
          a: "Yes, we offer exchanges for different sizes or colors within 30 days of purchase.",
        },
      ],
    },
    {
      category: "Payment & Pricing",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept GCash and Cash on Delivery (COD) for your convenience.",
        },
        {
          q: "Are prices shown in Philippine Peso?",
          a: "Yes, all prices are displayed in Philippine Peso (PHP) with the ₱ symbol.",
        },
        {
          q: "Do you offer discounts or promotions?",
          a: "Yes! Check our Promotions page for current sales and coupon codes.",
        },
      ],
    },
    {
      category: "Products & Sizing",
      questions: [
        {
          q: "How do I find my size?",
          a: "Please refer to our Size Guide page for detailed measurements and fitting information.",
        },
        {
          q: "Are your products authentic?",
          a: "Yes, all products sold at HASSANé Collections are 100% authentic and sourced directly from authorized suppliers.",
        },
        {
          q: "Do you restock sold-out items?",
          a: "We try to restock popular items when possible. Sign up for our newsletter to be notified of restocks.",
        },
      ],
    },
    {
      category: "Account & Privacy",
      questions: [
        {
          q: "Do I need an account to shop?",
          a: "No, you can checkout as a guest. However, creating an account allows you to track orders, save favorites, and checkout faster.",
        },
        {
          q: "How is my personal information protected?",
          a: "We take your privacy seriously. Please read our Privacy Policy for detailed information on how we protect your data.",
        },
        {
          q: "Can I change my account information?",
          a: "Yes, you can update your account information anytime from your Account page.",
        },
      ],
    },
  ];

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (faq) =>
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-muted-foreground">
          Find answers to common questions about our products and services
        </p>
      </div>

      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {filteredFaqs.map((category) => (
          <div key={category.category}>
            <h2 className="mb-4 text-2xl font-bold">{category.category}</h2>
            <Accordion type="single" collapsible className="w-full">
              {category.questions.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No FAQs found matching your search.
            </p>
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">Still have questions?</p>
        <Button asChild>
          <a href="/contact">Contact Us</a>
        </Button>
      </div>
    </div>
  );
}
