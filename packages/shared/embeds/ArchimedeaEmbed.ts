import { eta } from '#shared/utilities/WorldState';

import BaseEmbed from './BaseEmbed';
import type { EmbedBuildOptions } from './embedOptions';

export default class ArchimedeaEmbed extends BaseEmbed {
  constructor(archimedea, { platform, i18n, locale }: EmbedBuildOptions) {
    super(locale);

    // Internal EDA/ETA names cleanup
    const archimedeaNames: Record<string, string> = {
      'C T_ L A B': 'Deep Archimedea',
      'C T_ H E X': 'Temporal Archimedea',
    };
    console.log(JSON.stringify(archimedea.type));
    const activityName =
      archimedeaNames[archimedea.type] ?? archimedea.type;

    // Title
    this.title =
      i18n`[${platform.toUpperCase()}] Worldstate - ${activityName}`;
      this.url = undefined;

    // Mission fields
    this.fields = archimedea.missions.map((mission) => {
      const normalRisk = mission.risks?.find((risk) => !risk.isHard);
      const hardRisk = mission.risks?.find((risk) => risk.isHard);

      return {
        name: mission.missionType,
        value: [
          `**Deviation:** ${mission.deviation?.name ?? 'Unknown'}`,
          normalRisk ? `**Risk:** ${normalRisk.name}` : undefined,
          hardRisk ? `**Elite Risk:** ${hardRisk.name}` : undefined,
        ]
          .filter(Boolean)
          .join('\n'),
      };
    });

    // Personal modifiers
    this.fields.push({
      name: i18n`Personal Modifiers`,
      value:
        archimedea.personalModifiers
          ?.map((modifier) => modifier.name)
          .join('\n') || 'None',
    });

    // Time until reset
    this.footer.text = i18n`${eta(archimedea)} remaining`;
  }
}