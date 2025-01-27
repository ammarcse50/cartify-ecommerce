import { Metadata } from "next";
import React from "react";
import prisma from "../lib/db";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Cartique | Add-Product",
  description: "We serve cart to you!",
};

const page = () => {
  async function addproduct(formdata: FormData) {
    "use server";

    // Extract form values
    const name = formdata.get("name")?.toString();
    const description = formdata.get("description")?.toString();
    const image_url = formdata.get("image")?.toString();
    const price = Number(formdata.get("price") || 0);

    // Validate the fields
    if (!name || !description || !image_url || !price) {
      throw new Error("Missing fields");
    }

    // Create the product data object
    const product = {
      name,
      description,
      imageUrl: image_url, // This matches the Prisma field name
      price,
    };

    // Log the product for debugging
    console.log(product);

    // Insert the product into the database
    try {
      await prisma.products.create({
        data: product,
      });

      // Redirect to the home page after successful addition
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error("Failed to create product");
    }

    redirect("/");
  }

  return (
    <div>
      <h2 className="text-4xl m-5 font-extrabold text-center">Add Product</h2>

      <div className="card bg-base-100 w-1/2 mx-auto shrink-0 shadow-2xl">
        <form action={addproduct} className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              className="border-gray-200 border-2 "
            ></textarea>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Image URL</span>
            </label>
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Price</span>
            </label>
            <input
              type="number"
              name="price"
              placeholder="Price"
              max={200}
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
