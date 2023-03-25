import mongoose from "mongoose";
import Defect from "../models/defectSchema.js";

const createDefect = async (req, res) => {
  try {
    const { title, assignee, status, project, Comments } = req.body;
    if (!title) {
      return res.status(401).json({
        success: false,
        message: "Please enter the title",
      });
    }

    let userDefectId = String(await Defect.count({}));

    userDefectId = "DE-" + userDefectId.padStart(4, "0");
    // console.log(userDefectId);

    const defectCheck = await Defect.findOne({ userDefectId: userDefectId });

    // console.log(defectCheck);

    if (defectCheck) {
      return res.status(201).json({
        success: false,
        message: "Defect number error please contact your administrator",
      });
    }

    const defect = await Defect.create({
      title,
      assignee,
      userDefectId,
      Commentss: { $set: { defectdescription: Comments } },
      status,
      project,
    });

    return res.status(201).json({
      success: true,
      message: "Defect Created Successfully",
      defect,
    });
  } catch (err) {
    console.log(err);
  }
};

export { createDefect };
