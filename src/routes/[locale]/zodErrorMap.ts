import type { QRL } from "@builder.io/qwik";
import { $ } from "@builder.io/qwik";
import { z } from "@builder.io/qwik-city";

export const zodErrorMap: QRL<(locale?: string) => z.ZodErrorMap> = $(function (
  locale = "en"
) {
  return function (issue, ctx) {
    let message: string | undefined;
    const dateFormatter = new Intl.DateTimeFormat(locale, {});
    const numberFormatter = new Intl.NumberFormat(locale, {});

    const validations: Record<
      | "email"
      | "url"
      | "emoji"
      | "uuid"
      | "regex"
      | "cuid"
      | "cuid2"
      | "ulid"
      | "datetime"
      | "ip",
      string
    > = {
      email: $localize`Email`,
      url: $localize`URL`,
      uuid: $localize`UUID`,
      cuid: $localize`CUID`,
      regex: $localize`Regex`,
      datetime: $localize`Datetime`,
      emoji: $localize`Emoji`,
      ip: $localize`IP`,
      cuid2: $localize`CUID2`,
      ulid: $localize`ULID`,
    };

    switch (issue.code) {
      case z.ZodIssueCode.invalid_type:
        if (issue.received === z.ZodParsedType.undefined) {
          message = $localize`Required`;
        } else {
          message = $localize`Invalid type! Expected ${issue.expected}:expected:, received ${issue.received}:received:.`;
        }
        break;
      case z.ZodIssueCode.invalid_literal:
        message = $localize`Invalid literal! Expected ${issue.expected}:expected:, received ${issue.received}:received:.`;
        break;
      case z.ZodIssueCode.unrecognized_keys:
        message = $localize`Unrecognized keys: ${joinValues(issue.keys)}:keys:`;
        break;
      case z.ZodIssueCode.invalid_union:
        message = $localize`Invalid input`;
        break;
      case z.ZodIssueCode.invalid_union_discriminator:
        message = $localize`Invalid union discriminator: ${joinValues(
          issue.options
        )}:options:`;
        break;
      case z.ZodIssueCode.invalid_enum_value:
        message = $localize`Invalid enum value. Expected ${joinValues(
          issue.options
        )}:options:, received ${issue.received}:received:.`;
        break;
      case z.ZodIssueCode.invalid_arguments:
        message = $localize`Invalid arguments`;
        break;
      case z.ZodIssueCode.invalid_return_type:
        message = $localize`Invalid return type`;
        break;
      case z.ZodIssueCode.invalid_date:
        message = $localize`Invalid date`;
        break;
      case z.ZodIssueCode.invalid_string:
        if (typeof issue.validation === "object") {
          if ("startsWith" in issue.validation) {
            message = $localize`Invalid input: Must start with ${issue.validation.startsWith}:startsWith:`;
          } else if ("endsWith" in issue.validation) {
            message = $localize`Invalid input: Must end with ${issue.validation.endsWith}:endsWith:`;
          }
        } else {
          message = $localize`Invalid ${
            validations[issue.validation]
          }:validation:`;
        }
        break;
      case z.ZodIssueCode.too_small:
        const minimum =
          issue.type === "date"
            ? dateFormatter.format(new Date(issue.minimum as number))
            : issue.type === "number"
              ? numberFormatter.format(issue.minimum)
              : issue.minimum;

        if (issue.type === "array") {
          if (issue.exact) {
            message = $localize`Too small. Expected the array to have exactly ${minimum}:minimum: items`;
          } else if (issue.inclusive) {
            message = $localize`Too small. Expected the array to have at least ${minimum}:minimum: items`;
          } else {
            message = $localize`Too small. Expected the array to have more than ${minimum}:minimum: items`;
          }
        } else {
          if (issue.exact) {
            message = $localize`Too small. Expected the value to be exactly ${minimum}:minimum:`;
          } else if (issue.inclusive) {
            message = $localize`Too small. Expected the value to be at least ${minimum}:minimum:`;
          } else {
            message = $localize`Too small. Expected the value to be more than ${minimum}:minimum:`;
          }
        }

        break;
      case z.ZodIssueCode.too_big:
        const maximum =
          issue.type === "date"
            ? new Date(issue.maximum as number)
            : issue.type === "number"
              ? numberFormatter.format(issue.maximum)
              : issue.maximum;
        if (issue.type === "array") {
          if (issue.exact) {
            message = $localize`Too big. Expected the array to have exactly ${maximum}:maximum: items`;
          } else if (issue.inclusive) {
            message = $localize`Too big. Expected the array to have at most ${maximum}:maximum: items`;
          } else {
            message = $localize`Too big. Expected the array to have less than ${maximum}:maximum: items`;
          }
        } else {
          if (issue.exact) {
            message = $localize`Too big. Expected the value to be exactly ${maximum}:maximum:`;
          } else if (issue.inclusive) {
            message = $localize`Too big. Expected the value to be at most ${maximum}:maximum:`;
          } else {
            message = $localize`Too big. Expected the value to be less than ${maximum}:maximum:`;
          }
        }
        break;
      case z.ZodIssueCode.custom:
        message = issue.message ?? message;
        break;
      case z.ZodIssueCode.invalid_intersection_types:
        message = $localize`Intersection results could not be merged`;
        break;
      case z.ZodIssueCode.not_multiple_of:
        message = $localize`Number must be a multiple of ${issue.multipleOf}:multipleOf:`;
        break;
      case z.ZodIssueCode.not_finite:
        message = $localize`Number must be finite`;
        break;
      default:
        console.log("OHHH NEIN", issue);

        break;
    }
    console.log(`The locale inside the action is ${locale}`);

    return { message: message ?? ctx.defaultError };
  };
});

function joinValues<T extends any[]>(array: T, separator = " | "): string {
  return array
    .map(val => (typeof val === "string" ? `'${val}'` : val))
    .join(separator);
}

export default zodErrorMap;
