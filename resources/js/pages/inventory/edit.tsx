"use client"
import type React from "react"

import { Head, useForm, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, User } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { useEffect } from "react"
import TopNav from "@/components/top-nav"

interface PageProps {
  auth: {
    user: User
  }
  [key: string]: any
}

interface InventoryFormData {
  name: string
  description: string
  category_id: number | null
  packaging_type: string
  quantity: number
  cost_price: string
  selling_price: string
  discount_price: string
  manufacturer: string
  status: string
  [key: string]: string | number | null
}

interface Props {
  inventory: {
    id: number
    name: string
    description: string
    category_id: number | null
    packaging_type: string
    quantity: number
    cost_price: string
    selling_price: string
    discount_price: string
    manufacturer: string
    status: string
  }
  categories: { id: number; name: string; status: string }[]
}

export default function EditInventory({ inventory, categories }: Props) {
  const { auth } = usePage<PageProps>().props

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Inventory",
      href: "/inventory",
    },
    {
      title: inventory.name,
      href: `/inventory/${inventory.id}`,
    },
    {
      title: "Edit",
      href: `/inventory/${inventory.id}/edit`,
    },
  ]

  const { data, setData, put, processing, errors, reset } = useForm<InventoryFormData>({
    name: inventory.name || "",
    description: inventory.description || "",
    category_id: inventory.category_id,
    packaging_type: inventory.packaging_type || "",
    quantity: inventory.quantity || 0,
    cost_price: inventory.cost_price || "",
    selling_price: inventory.selling_price || "",
    discount_price: inventory.discount_price || "",
    manufacturer: inventory.manufacturer || "",
    status: inventory.status || "active",
  })

  // Reset form when inventory changes
  useEffect(() => {
    setData({
      name: inventory.name || "",
      description: inventory.description || "",
      category_id: inventory.category_id,
      packaging_type: inventory.packaging_type || "",
      quantity: inventory.quantity || 0,
      cost_price: inventory.cost_price || "",
      selling_price: inventory.selling_price || "",
      discount_price: inventory.discount_price || "",
      manufacturer: inventory.manufacturer || "",
      status: inventory.status || "active",
    })
  }, [inventory, setData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(`/inventory/${inventory.id}`)
  }

  const packagingOptions = ["Bottle", "Can", "Box", "Bag", "Pouch", "Carton", "Jar", "Sachet", "Tetra Pack"]
  const statusOptions = ["active", "inactive", "discontinued"]

  return (
    <>
      <TopNav user={auth.user} />
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={`Edit ${inventory.name}`} />

        <div className="container mx-auto py-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl font-bold">Edit Inventory Item</h1>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inventory
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Edit Item Details</CardTitle>
                <CardDescription>Update the details of this inventory item</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Column 1 - Basic Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Item Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="Enter item name"
                        required
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="manufacturer">Manufacturer</Label>
                      <Input
                        id="manufacturer"
                        value={data.manufacturer}
                        onChange={(e) => setData("manufacturer", e.target.value)}
                        placeholder="Enter manufacturer name"
                      />
                      {errors.manufacturer && <p className="text-sm text-destructive">{errors.manufacturer}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={data.status} onValueChange={(value) => setData("status", value)}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status} className="capitalize">
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                    </div>
                  </div>

                  {/* Column 2 - Classification */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category_id">Category</Label>
                      <Select
                        value={data.category_id?.toString() || ""}
                        onValueChange={(value) => setData("category_id", value ? Number.parseInt(value) : null)}
                      >
                        <SelectTrigger id="category_id">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="-1">None</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="packaging_type">Packaging Type</Label>
                      <Select
                        value={data.packaging_type || "none"}
                        onValueChange={(value) => setData("packaging_type", value === "none" ? "" : value)}
                      >
                        <SelectTrigger id="packaging_type">
                          <SelectValue placeholder="Select packaging type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="-1">None</SelectItem>
                          {packagingOptions.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.packaging_type && <p className="text-sm text-destructive">{errors.packaging_type}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">
                        Quantity <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="0"
                        value={data.quantity}
                        onChange={(e) => setData("quantity", Number.parseInt(e.target.value) || 0)}
                        placeholder="Enter quantity"
                        required
                      />
                      {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
                    </div>
                  </div>

                  {/* Column 3 - Pricing */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cost_price">Cost Price (UGX)</Label>
                      <Input
                        id="cost_price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.cost_price}
                        onChange={(e) => setData("cost_price", e.target.value)}
                        placeholder="Enter cost price"
                      />
                      {errors.cost_price && <p className="text-sm text-destructive">{errors.cost_price}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="selling_price">
                        Selling Price (UGX) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="selling_price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.selling_price}
                        onChange={(e) => setData("selling_price", e.target.value)}
                        placeholder="Enter selling price"
                        required
                      />
                      {errors.selling_price && <p className="text-sm text-destructive">{errors.selling_price}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discount_price">Discount Price (UGX)</Label>
                      <Input
                        id="discount_price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.discount_price}
                        onChange={(e) => setData("discount_price", e.target.value)}
                        placeholder="Enter discount price (if applicable)"
                      />
                      <p className="text-xs text-muted-foreground">Leave empty if no discount applies</p>
                      {errors.discount_price && <p className="text-sm text-destructive">{errors.discount_price}</p>}
                    </div>
                  </div>
                </div>

                {/* Description Field - Full Width Row */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    placeholder="Enter item description"
                    className="min-h-[100px]"
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  <Save className="mr-2 h-4 w-4" />
                  Update Item
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </AppLayout>
    </>
  )
}

