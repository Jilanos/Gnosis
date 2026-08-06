{
  "budgets": {
    "max_docs": 16,
    "max_docs_per_ref": 4
  },
  "changed_paths": [
    "logics/backlog/item_015_remplacer_les_douze_assets_client_gnosis.md",
    "logics/backlog/item_016_publier_la_version_1_1_8_apres_remplacement_des_assets.md",
    "logics/product/prod_006_identite_gnosis_alignee_sur_icones_v3_corrige.md",
    "logics/request/req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges.md",
    "logics/scaffold/icones_v3_correction.json",
    "logics/tasks/task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges.md"
  ],
  "command": "logics-manager sync context-pack req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges item_015_remplacer_les_douze_assets_client_gnosis item_016_publier_la_version_1_1_8_apres_remplacement_des_assets task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges --mode diff-first --profile normal --handoff",
  "companion_docs": [
    {
      "kind": "product",
      "linked_refs": {
        "item": [
          "item_015_remplacer_les_douze_assets_client_gnosis",
          "item_016_publier_la_version_1_1_8_apres_remplacement_des_assets"
        ],
        "prod": [
          "prod_006_identite_gnosis_alignee_sur_icones_v3_corrige"
        ],
        "req": [
          "req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges"
        ],
        "task": [
          "task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges"
        ]
      },
      "path": "logics/product/prod_006_identite_gnosis_alignee_sur_icones_v3_corrige.md",
      "ref": "prod_006_identite_gnosis_alignee_sur_icones_v3_corrige",
      "sections": {
        "Goals": [
          "- Supprimer toute trace du lot d'images errone.",
          "- Conserver les noms de fichiers pour eviter une refonte des imports."
        ],
        "Key product decisions": [
          "- Use structured input as the source of truth for generated docs.",
          "- Keep generated write paths local and repo-bounded."
        ],
        "Overview": [
          "Les assets Gnosis, Kapsule et Paul Mondou servis par le client doivent venir des masters approuves."
        ],
        "References": [
          "- Product back-reference: `req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges`",
          "- Task back-reference: `task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges`"
        ]
      },
      "status": "Proposed",
      "title": "Identite Gnosis alignee sur Icones V3 corrige"
    }
  ],
  "docs": [
    {
      "ai_context": {
        "keywords": "request-chain-scaffold, remplacer les assets gnosis par les masters icones v3 corriges, development-ready",
        "skip when": "The change is unrelated to this scaffolded request chain.",
        "summary": "Remplacer les assets Gnosis par les masters Icones V3 corriges",
        "use when": "You need to implement or review the scaffolded workflow for Remplacer les assets Gnosis par les masters Icones V3 corriges."
      },
      "kind": "request",
      "linked_refs": {
        "item": [
          "item_015_remplacer_les_douze_assets_client_gnosis",
          "item_016_publier_la_version_1_1_8_apres_remplacement_des_assets"
        ],
        "prod": [
          "prod_006_identite_gnosis_alignee_sur_icones_v3_corrige"
        ],
        "req": [
          "req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges"
        ]
      },
      "path": "logics/request/req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges.md",
      "ref": "req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges",
      "schema_version": "1.0",
      "sections": {
        "Acceptance criteria": [
          "- AC1: Chaque fichier d'icone livre est octet pour octet le master correspondant de Icones V3.",
          "- AC2: Aucune reference d'asset n'est cassee apres remplacement, extensions et types MIME inclus.",
          "- AC3: Le rendu est verifie visuellement sur le theme reellement servi par l'application.",
          "- AC4: La transparence des masters est preservee: aucun fond, plaque ou cartouche n'est ajoute derriere l'asset, favicon et embleme compris.",
          "- AC5: La livraison se termine par un commit de version X.Y.Z+1, un push, puis un tag annote vX.Y.Z+1 dont le workflow release est vert."
        ],
        "Needs": [
          "- Remplacer les douze PNG de `src/client/assets/` par les masters corriges, en dupliquant le master unique sur les variantes dark et light."
        ]
      },
      "status": "Draft",
      "title": "Remplacer les assets Gnosis par les masters Icones V3 corriges"
    },
    {
      "ai_context": {
        "keywords": "scaffolded-backlog, remplacer les douze assets client gnosis, implementation-ready",
        "skip when": "The change belongs to another backlog slice.",
        "summary": "Remplacer les douze assets client Gnosis",
        "use when": "Implementing the scaffolded slice for Remplacer les douze assets client Gnosis."
      },
      "kind": "backlog",
      "linked_refs": {
        "item": [
          "item_015_remplacer_les_douze_assets_client_gnosis"
        ],
        "prod": [
          "prod_006_identite_gnosis_alignee_sur_icones_v3_corrige"
        ],
        "req": [
          "req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges"
        ],
        "task": [
          "task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges"
        ]
      },
      "path": "logics/backlog/item_015_remplacer_les_douze_assets_client_gnosis.md",
      "ref": "item_015_remplacer_les_douze_assets_client_gnosis",
      "schema_version": "1.0",
      "sections": {
        "Acceptance criteria": [
          "- AC1: Les douze fichiers correspondent aux masters attendus.",
          "- AC2: Aucun import de `src/client` n'est casse et le favicon reste resolu.",
          "- AC3: Embleme et icone s'affichent correctement dans les deux themes du client."
        ],
        "Problem": [
          "- Les assets embarques par le client Vite proviennent d'un lot errone."
        ]
      },
      "status": "Ready",
      "title": "Remplacer les douze assets client Gnosis"
    },
    {
      "ai_context": {
        "keywords": "scaffolded-backlog, publier la version 1.1.8 apres remplacement des assets, implementation-ready",
        "skip when": "The change belongs to another backlog slice.",
        "summary": "Publier la version 1.1.8 apres remplacement des assets",
        "use when": "Implementing the scaffolded slice for Publier la version 1.1.8 apres remplacement des assets."
      },
      "kind": "backlog",
      "linked_refs": {
        "item": [
          "item_016_publier_la_version_1_1_8_apres_remplacement_des_assets"
        ],
        "prod": [
          "prod_006_identite_gnosis_alignee_sur_icones_v3_corrige"
        ],
        "req": [
          "req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges"
        ],
        "task": [
          "task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges"
        ]
      },
      "path": "logics/backlog/item_016_publier_la_version_1_1_8_apres_remplacement_des_assets.md",
      "ref": "item_016_publier_la_version_1_1_8_apres_remplacement_des_assets",
      "schema_version": "1.0",
      "sections": {
        "Acceptance criteria": [
          "- AC1: Toutes les surfaces canoniques declarent `1.1.8`.",
          "- AC2: Le tag annote `v1.1.8` pointe sur le commit de version pousse sur `main`.",
          "- AC3: Le workflow release est vert sur validate, publish, deploy et release.",
          "- AC4: Le SHA, le tag et l'URL du run sont consignes dans le closeout de la tache."
        ],
        "Problem": [
          "- Sans commit de version ni tag, les nouveaux assets restent non deployes: le tag `v1.1.8` est le seul declencheur du deploiement."
        ]
      },
      "status": "Ready",
      "title": "Publier la version 1.1.8 apres remplacement des assets"
    },
    {
      "ai_context": {},
      "kind": "product",
      "linked_refs": {
        "item": [
          "item_015_remplacer_les_douze_assets_client_gnosis",
          "item_016_publier_la_version_1_1_8_apres_remplacement_des_assets"
        ],
        "prod": [
          "prod_006_identite_gnosis_alignee_sur_icones_v3_corrige"
        ],
        "req": [
          "req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges"
        ],
        "task": [
          "task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges"
        ]
      },
      "path": "logics/product/prod_006_identite_gnosis_alignee_sur_icones_v3_corrige.md",
      "ref": "prod_006_identite_gnosis_alignee_sur_icones_v3_corrige",
      "schema_version": "1.0",
      "sections": {},
      "status": "Proposed",
      "title": "Identite Gnosis alignee sur Icones V3 corrige"
    },
    {
      "ai_context": {
        "keywords": "scaffolded-task, request-chain-scaffold, orchestration",
        "skip when": "Working on one isolated sibling slice.",
        "summary": "Remplacer les assets Gnosis par les masters Icones V3 corriges",
        "use when": "Coordinating implementation of a scaffolded request chain."
      },
      "kind": "task",
      "linked_refs": {
        "item": [
          "item_015_remplacer_les_douze_assets_client_gnosis",
          "item_016_publier_la_version_1_1_8_apres_remplacement_des_assets"
        ],
        "prod": [
          "prod_006_identite_gnosis_alignee_sur_icones_v3_corrige"
        ],
        "req": [
          "req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges"
        ],
        "task": [
          "task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges"
        ]
      },
      "path": "logics/tasks/task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges.md",
      "ref": "task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges",
      "schema_version": "1.0",
      "sections": {
        "Context": [
          "- Orchestrate the scaffolded request chain and keep sibling implementation slices linked."
        ],
        "Validation": [
          "- (no validation recorded yet)"
        ]
      },
      "status": "Ready",
      "title": "Remplacer les assets Gnosis par les masters Icones V3 corriges"
    }
  ],
  "estimates": {
    "char_count": 7672,
    "companion_doc_count": 1,
    "doc_count": 5
  },
  "generated_at": "2026-08-06T16:48:12Z",
  "handoff": {
    "companion_doc_count": 1,
    "enabled": true,
    "source_refs": [
      "req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges",
      "item_015_remplacer_les_douze_assets_client_gnosis",
      "item_016_publier_la_version_1_1_8_apres_remplacement_des_assets",
      "task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges"
    ],
    "validation_summary_count": 1
  },
  "i18n": {
    "actions": [
      "Choose the source locale for app-owned user-facing copy.",
      "Run logics-manager i18n init --source-locale <locale>.",
      "Route new UI copy through stable semantic keys."
    ],
    "applicable": null,
    "configured": false,
    "contract_path": "logics/i18n/contract.json",
    "findings": [],
    "next_action": "Run logics-manager i18n init --source-locale <locale> for a project that owns user-facing copy.",
    "ok": true,
    "state": "absent"
  },
  "mode": "diff-first",
  "profile": "normal",
  "ref": "req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges,item_015_remplacer_les_douze_assets_client_gnosis,item_016_publier_la_version_1_1_8_apres_remplacement_des_assets,task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges",
  "refs": [
    "req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges",
    "item_015_remplacer_les_douze_assets_client_gnosis",
    "item_016_publier_la_version_1_1_8_apres_remplacement_des_assets",
    "task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges"
  ],
  "release": {
    "blocking_reasons": [
      "version_metadata: evidence targets a different version",
      "changelog: evidence targets a different version",
      "local_validation: evidence targets a different version",
      "git_push: evidence targets a different version",
      "ci: evidence targets a different version",
      "github_release: evidence targets a different version"
    ],
    "configured": true,
    "contract_path": "logics/release/contract.json",
    "guidance": [
      "Release readiness must come from project-owned evidence, not conversational memory.",
      "Use release status or validate before preparing or claiming release readiness.",
      "Publication-oriented actions are explicit operator actions and are separate from safe read/validate actions."
    ],
    "next_action": "version_metadata: evidence targets a different version",
    "publication_actions": [
      "GitHub release publication",
      "external publication"
    ],
    "required_gates": [
      {
        "blocking_reason": "evidence targets a different version",
        "id": "version_metadata",
        "required": true,
        "state": "preparing",
        "status": "stale"
      },
      {
        "blocking_reason": "evidence targets a different version",
        "id": "changelog",
        "required": true,
        "state": "preparing",
        "status": "stale"
      },
      {
        "blocking_reason": "evidence targets a different version",
        "id": "local_validation",
        "required": true,
        "state": "local_validation",
        "status": "stale"
      },
      {
        "blocking_reason": "evidence targets a different version",
        "id": "git_push",
        "required": true,
        "state": "pushed",
        "status": "stale"
      },
      {
        "blocking_reason": "evidence targets a different version",
        "id": "ci",
        "required": true,
        "state": "ci_verification",
        "status": "stale"
      },
      {
        "blocking_reason": "evidence targets a different version",
        "id": "github_release",
        "required": true,
        "state": "github_release",
        "status": "stale"
      }
    ],
    "safe_actions": [
      "logics-manager release status",
      "logics-manager release plan <version>",
      "logics-manager release validate <version>"
    ],
    "state": "blocked",
    "target_version": "1.1.7"
  },
  "validation_summary": [
    {
      "items": [
        "- (no validation recorded yet)"
      ],
      "path": "logics/tasks/task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges.md",
      "ref": "task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges"
    }
  ]
}
