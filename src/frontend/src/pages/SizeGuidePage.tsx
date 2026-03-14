import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

export default function SizeGuidePage() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Size Guide</h1>
        <p className="text-lg text-muted-foreground">
          Find your perfect fit with our comprehensive sizing information
        </p>
      </div>

      <Tabs defaultValue="women" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="women">Women</TabsTrigger>
          <TabsTrigger value="men">Men</TabsTrigger>
          <TabsTrigger value="kids">Kids</TabsTrigger>
          <TabsTrigger value="shoes">Shoes</TabsTrigger>
        </TabsList>

        <TabsContent value="women" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Women's Clothing</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Bust (cm)</TableHead>
                    <TableHead>Waist (cm)</TableHead>
                    <TableHead>Hips (cm)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">XS</TableCell>
                    <TableCell>81-84</TableCell>
                    <TableCell>61-64</TableCell>
                    <TableCell>86-89</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">S</TableCell>
                    <TableCell>86-89</TableCell>
                    <TableCell>66-69</TableCell>
                    <TableCell>91-94</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">M</TableCell>
                    <TableCell>91-94</TableCell>
                    <TableCell>71-74</TableCell>
                    <TableCell>96-99</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">L</TableCell>
                    <TableCell>96-99</TableCell>
                    <TableCell>76-79</TableCell>
                    <TableCell>101-104</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">XL</TableCell>
                    <TableCell>101-104</TableCell>
                    <TableCell>81-84</TableCell>
                    <TableCell>106-109</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Measure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>
                <strong>Bust:</strong> Measure around the fullest part of your
                bust
              </p>
              <p>
                <strong>Waist:</strong> Measure around the narrowest part of
                your waist
              </p>
              <p>
                <strong>Hips:</strong> Measure around the fullest part of your
                hips
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="men" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Men's Clothing</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Chest (cm)</TableHead>
                    <TableHead>Waist (cm)</TableHead>
                    <TableHead>Hips (cm)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">S</TableCell>
                    <TableCell>86-91</TableCell>
                    <TableCell>71-76</TableCell>
                    <TableCell>86-91</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">M</TableCell>
                    <TableCell>96-101</TableCell>
                    <TableCell>81-86</TableCell>
                    <TableCell>96-101</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">L</TableCell>
                    <TableCell>106-111</TableCell>
                    <TableCell>91-96</TableCell>
                    <TableCell>106-111</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">XL</TableCell>
                    <TableCell>116-121</TableCell>
                    <TableCell>101-106</TableCell>
                    <TableCell>116-121</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">XXL</TableCell>
                    <TableCell>126-131</TableCell>
                    <TableCell>111-116</TableCell>
                    <TableCell>126-131</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Measure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>
                <strong>Chest:</strong> Measure around the fullest part of your
                chest
              </p>
              <p>
                <strong>Waist:</strong> Measure around your natural waistline
              </p>
              <p>
                <strong>Hips:</strong> Measure around the fullest part of your
                hips
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kids" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kids' Clothing</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Height (cm)</TableHead>
                    <TableHead>Chest (cm)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">2T</TableCell>
                    <TableCell>2 years</TableCell>
                    <TableCell>86-91</TableCell>
                    <TableCell>51-53</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3T</TableCell>
                    <TableCell>3 years</TableCell>
                    <TableCell>91-99</TableCell>
                    <TableCell>53-56</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">4T</TableCell>
                    <TableCell>4 years</TableCell>
                    <TableCell>99-107</TableCell>
                    <TableCell>56-58</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">5-6</TableCell>
                    <TableCell>5-6 years</TableCell>
                    <TableCell>107-119</TableCell>
                    <TableCell>58-61</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">7-8</TableCell>
                    <TableCell>7-8 years</TableCell>
                    <TableCell>119-132</TableCell>
                    <TableCell>61-66</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shoe Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>US Size</TableHead>
                    <TableHead>EU Size</TableHead>
                    <TableHead>UK Size</TableHead>
                    <TableHead>CM</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">6</TableCell>
                    <TableCell>36</TableCell>
                    <TableCell>3.5</TableCell>
                    <TableCell>22.5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">7</TableCell>
                    <TableCell>37</TableCell>
                    <TableCell>4.5</TableCell>
                    <TableCell>23.5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">8</TableCell>
                    <TableCell>38</TableCell>
                    <TableCell>5.5</TableCell>
                    <TableCell>24.5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">9</TableCell>
                    <TableCell>39</TableCell>
                    <TableCell>6.5</TableCell>
                    <TableCell>25.5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">10</TableCell>
                    <TableCell>40</TableCell>
                    <TableCell>7.5</TableCell>
                    <TableCell>26.5</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Measure Your Feet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>1. Place your foot on a piece of paper</p>
              <p>2. Mark the longest point of your foot</p>
              <p>3. Measure the distance from heel to toe in centimeters</p>
              <p>4. Compare with the size chart above</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you're unsure about sizing or need personalized assistance, our
            customer service team is here to help.
          </p>
          <Button asChild>
            <a href="/contact">Contact Us</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
