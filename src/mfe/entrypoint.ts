import { DrawerExperienceContributionHost } from "@workiva/drawer_experience_contribution";
import {
  createEsmExtension,
  type ContributionHost,
} from "@workiva/microfrontend";
import { AgenticCrrContribution } from "./contribution";

/**
 * Wdesk microfrontend entrypoint. The frame loads this ESM module and registers
 * the Agentic CRR drawer experience; the manifest's navigation_sidebar
 * contribution surfaces it as the "Agentic CRR" tab. This file is the only
 * build entry for the MFE bundle (see vite.mfe.config.ts) and is intentionally
 * excluded from the standalone SPA build.
 */
export default createEsmExtension({
  contributions: [
    new DrawerExperienceContributionHost(
      new AgenticCrrContribution(),
    ) as unknown as ContributionHost,
  ],
});
