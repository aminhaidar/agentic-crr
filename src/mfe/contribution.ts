import {
  type DrawerExperience,
  DrawerExperienceContribution,
} from "@workiva/drawer_experience_contribution";
import { AgenticCrrExperience } from "./experience";

/** Names must match the manifest's agentic_crr_extension / agentic_crr_drawer. */
const simpleName = "agentic_crr_drawer";
const extensionName = "agentic_crr_extension";

export class AgenticCrrContribution extends DrawerExperienceContribution {
  readonly simpleName: string = simpleName;
  readonly extensionName: string = extensionName;

  openExperience(): Promise<DrawerExperience> {
    return Promise.resolve(new AgenticCrrExperience());
  }
}
