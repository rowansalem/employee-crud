"use client";

import FormSelectInput from "@/components/form/select/form-select";
import FormTextInput from "@/components/form/text-input/form-text-input";
import Link from "@/components/link";
import { usePostEmployeeService } from "@/services/api/services/employees";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { PositionEnum } from "@/services/api/types/position";
import { Role } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import useLeavePage from "@/services/leave-page/use-leave-page";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import * as yup from "yup";

type CreateEmployeeFormData = {
  email: string;
  lastName: string;
  firstName: string;
  salary: number;
  position: { id: PositionEnum };
};

const useValidationSchema = () => {
  const { t } = useTranslation("admin-panel-employees-create");

  return yup.object().shape({
    email: yup
      .string()
      .email(t('admin-panel-employees-create:inputs.email.validation.invalid'))
      .required(t('admin-panel-employees-create:inputs.email.validation.required')),
    firstName: yup.string().required(t('admin-panel-employees-create:inputs.firstName.validation.required')),
    lastName: yup.string().required(t('admin-panel-employees-create:inputs.lastName.validation.required')),
    position: yup.object()
      .shape({
        id: yup.mixed<PositionEnum>().required(),
      }).required(t('admin-panel-employees-create:inputs.yup.validation.required')),
    salary: yup.number().required(t('admin-panel-employees-create:inputs.salary.validation.required')),
  });
};

function CreateEmployeeFormActions() {
  const { t } = useTranslation("admin-panel-employees-create");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
    >
      {t("admin-panel-employees-create:actions.submit")}
    </Button>
  );
}

function FormCreateEmployee() {
  const router = useRouter();
  const fetchPostEmployee = usePostEmployeeService();
  const { t } = useTranslation("admin-panel-employees-create");
  const validationSchema = useValidationSchema();

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<CreateEmployeeFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      position: { id: PositionEnum.JUNIOR },
      salary: 0,
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchPostEmployee(formData);
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof CreateEmployeeFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `admin-panel-employees-create:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        }
      );
      return;
    }
    if (status === HTTP_CODES_ENUM.CREATED) {
      enqueueSnackbar(t("admin-panel-employees-create:alerts.employee.success"), {
        variant: "success",
      });
      router.push("/admin-panel/employees");
    }
  });

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit} autoComplete="create-new-employee">
          <Grid container spacing={2} mb={3} mt={3}>
            <Grid item xs={12}>
              <Typography variant="h6">{t('admin-panel-employees-create:title')}</Typography>
            </Grid>

            <Grid item xs={12}>
              <FormTextInput<CreateEmployeeFormData>
                name="email"
                testId="new-employee-email"
                autoComplete="new-employee-email"
                label={t('admin-panel-employees-create:inputs.email.label')}
              />
            </Grid>

            <Grid item xs={12}>
              <FormTextInput<CreateEmployeeFormData>
                name="firstName"
                testId="new-employee-name"
                autoComplete="new-employee-name"
                label={t('admin-panel-employees-create:inputs.firstName.label')}
              />
            </Grid>

            <Grid item xs={12}>
              <FormTextInput<CreateEmployeeFormData>
                name="lastName"
                testId="new-employee-lastName"
                autoComplete="new-employee-lastName"
                label={t('admin-panel-employees-create:inputs.lastName.label')}
              />
            </Grid>

            <Grid item xs={12}>
              <FormTextInput<CreateEmployeeFormData>
                name="salary"
                type="number"
                testId="salary"
                label={t('admin-panel-employees-create:inputs.salary.label')}
              />
            </Grid>

            <Grid item xs={12}>
              <FormSelectInput<CreateEmployeeFormData, Pick<Role, 'id'>>
                name="position"
                testId="position"
                label={t('admin-panel-employees-create:inputs.position.label')}
                options={[
                  {
                    id: PositionEnum.JUNIOR,
                  },
                  {
                    id: PositionEnum.SENIOR,
                  },
                  {
                    id: PositionEnum.MANAGER,
                  },
                ]}
                keyValue="id"
                renderOption={(option) => t(`admin-panel-employees-create:inputs.position.options.${option.id}`)}
              />
            </Grid>

            <Grid item xs={12}>
              <CreateEmployeeFormActions />
              <Box ml={1} component="span">
                <Button variant="contained" color="inherit" LinkComponent={Link} href="/admin-panel/employees">
                  {t('admin-panel-employees-create:actions.cancel')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}

function CreateEmployee() {
  return <FormCreateEmployee />;
}

export default withPageRequiredAuth(CreateEmployee);
