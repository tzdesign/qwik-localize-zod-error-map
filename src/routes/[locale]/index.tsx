import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Form, routeAction$, z } from "@builder.io/qwik-city";
import flattenZodIssues from "./flattenZodErrors";
import zodErrorMap from "./zodErrorMap";

export default component$(() => {
  const action = useTheAmazingAction();
  useStylesScoped$(`
		.card {
			width: 300px;
			border-radius: .5rem;
			border: 1px black solid;
			background-color: white;
			color: black;
      margin: auto;
      text-align:center;
      padding: 2rem;
      margin-top: 4rem;
		}

    .links {
      display: flex;
      justify-content: space-evenly;
			padding: 1.25rem 0;
    }

    .link {
      font-weight: 500;
      color: rgb(63 131 248/1);
    }
	`);
  const name = "Qwik";
  return (
    <div class="card">
      <div style="padding-bottom: 1.25rem;">
        <div style="font-weight: 700; font-size: 1.5rem;">{$localize`Hello from ${name}!`}</div>
      </div>
      <div style="padding-bottom: 1.25rem;">
        <div style="font-weight: 700; font-size: 1.0rem;">
          {$localize`Use the following links to change the translation.`}
          <div class="links">
            <a class="link" href="/en/">
              English
            </a>
            <a class="link" href="/it/">
              Italiano
            </a>
            <a class="link" href="/de/">
              German
            </a>
          </div>
          <div style="font-size: 1.0rem;">
            {$localize`Translation is performed as part of the build step so translated strings are inlined into the application, there is no need to load or look them up at runtime. However, these advantages mean that the user cannot change the language without refreshing the page.`}
          </div>
          <br />
          <Form action={action}>
            {action.value?.someData && (
              <pre>{JSON.stringify(action.value.someData, null, 2)}</pre>
            )}
            {action.value?.failed && (
              <pre>{JSON.stringify(action.value, null, 2)}</pre>
            )}
            <button type="submit">{$localize`Try it`}</button>
          </Form>
        </div>
      </div>
    </div>
  );
});

export const useTheAmazingAction = routeAction$(async (data, event) => {
  z.setErrorMap(await zodErrorMap(event.locale()));
  console.log(data);

  const someSchema = z.object({
    name: z.string(),
    age: z.number(),
  });
  try {
    const someData = someSchema.parse(data);
    return { someData };
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return event.fail(500, flattenZodIssues(error.issues));
    }
  }
});
