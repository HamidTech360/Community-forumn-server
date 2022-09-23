import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { AnyKeys } from "mongoose";
import Category from "../models/Categories";
import User, { IUserSchema } from "../models/User";

export const createCategory = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name, type } = req.body;
    try {
      const newCategory = await Category.create({
        ...req.body,
      });
      res.json({
        message: "category created",
        category: newCategory,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export const getCategories = expressAsyncHandler(
  async (req: any, res: Response) => {
    try {
      const allCategories = await Category.find();
      res.json({
        mesage: "All categories fetched",
        allCategories,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export const deleteCategories = expressAsyncHandler(
  async (req: any, res: any) => {
    try {
      await Category.findByIdAndDelete(req.query.id);
      res.json({
        message: "Category deleted",
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export const updateCategory = expressAsyncHandler(
  async (req: any, res: Response) => {
    try {
      await Category.findByIdAndUpdate(req.query.id, {
        ...req.body,
      });
      res.json({
        message: "Category updated!!",
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);
