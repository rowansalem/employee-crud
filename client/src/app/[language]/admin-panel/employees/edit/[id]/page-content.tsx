"use client";

import FormSelectInput from "@/components/form/select/form-select";
import FormTextInput from "@/components/form/text-input/form-text-input";
import Link from "@/components/link";
import {
  useGetEmployeeService,
  usePatchEmployeeService,
} from "@/services/api/services/employees";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { PositionEnum } from "@/services/api/types/position";
import {  Role } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import useLeavePage from "@/services/leave-page/use-leave-page";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import * as yup from "yup";

type EditEmployeeFormData = {
  email: string;
  firstName: string;
  lastName: string;
  salary: number;
  position: { id: PositionEnum };
};

type ChangeEmployeePasswordFormData = {
  password: string;
  passwordConfirmation: string;
};

const useValidationEditEmployeeSchema = () => {
  const { t } = useTranslation("admin-panel-employees-edit");

  return yup.object().shape({
    email: yup
      .string()
      .email(t('admin-panel-employees-edit:inputs.email.validation.invalid'))
      .required(t('admin-panel-employees-edit:inputs.email.validation.required')),
    firstName: yup.string().required(t('admin-panel-employees-edit:inputs.firstName.validation.required')),
    lastName: yup.string().required(t('admin-panel-employees-edit:inputs.lastName.validation.required')),
    salary: yup.number().required(t('admin-panel-employees-edit:inputs.salary.validation.required')),
    position: yup.object()
      .shape({
        id: yup.mixed<PositionEnum>().required()
      }).required(t('admin-panel-employees-edit:inputs.position.validation.required')),
  });
};

const useValidationChangePasswordSchema = () => {
  const { t } = useTranslation("admin-panel-employees-edit");

  return yup.object().shape({
    password: yup
      .string()
      .required(
        t("admin-panel-employees-edit:inputs.password.validation.required")
      ),
    passwordConfirmation: yup
      .string()
      .oneOf(
        [yup.ref("password")],
        t("admin-panel-employees-edit:inputs.passwordConfirmation.validation.match")
      )
      .required(
        t(
          "admin-panel-employees-edit:inputs.passwordConfirmation.validation.required"
        )
      ),
  });
};

function EditEmployeeFormActions() {
  const { t } = useTranslation("admin-panel-employees-edit");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
    >
      {t("admin-panel-employees-edit:actions.submit")}
    </Button>
  );
}

function ChangePasswordEmployeeFormActions() {
  const { t } = useTranslation("admin-panel-employees-edit");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
    >
      {t("admin-panel-employees-edit:actions.submit")}
    </Button>
  );
}

function FormEditEmployee() {
  const params = useParams();
  const fetchGetEmployee = useGetEmployeeService();
  const fetchPatchEmployee = usePatchEmployeeService();
  const { t } = useTranslation("admin-panel-employees-edit");
  const validationSchema = useValidationEditEmployeeSchema();
  const employeeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<EditEmployeeFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      salary: 0,
      position: { id: PositionEnum.JUNIOR },
    },
  });

  const { handleSubmit, setError, reset } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const isEmailDirty = methods.getFieldState("email").isDirty;
    const { data, status } = await fetchPatchEmployee({
      id: employeeId,
      data: {
        ...formData,
        email: isEmailDirty ? formData.email : undefined,
        position:{id: formData.position.id}
      },
    });
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof EditEmployeeFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `admin-panel-employees-edit:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        }
      );
      return;
    }
    if (status === HTTP_CODES_ENUM.OK) {
      reset(formData);
      enqueueSnackbar(t("admin-panel-employees-edit:alerts.employee.success"), {
        variant: "success",
      });
    }
  });

  useEffect(() => {
    const getInitialDataForEdit = async () => {
      const { status, data: employee } = await fetchGetEmployee({ id: employeeId });

      if (status === HTTP_CODES_ENUM.OK) {
        reset({
          email: employee?.email ?? '',
          firstName: employee?.firstName ?? '',
          lastName: employee?.lastName ?? '',
          salary: employee?.salary ?? 0,
          position: employee?.position ?? { id: PositionEnum.JUNIOR },
        });
      }
    };

    getInitialDataForEdit();
  }, [employeeId, reset, fetchGetEmployee]);

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit}>
          <Grid container spacing={2} mb={3} mt={3}>
            <Grid item xs={12}>
              <Typography variant="h6">{t('admin-panel-employees-edit:title1')}</Typography>
            </Grid>

            <Grid item xs={12}>
              <FormTextInput<EditEmployeeFormData>
                name="email"
                testId="email"
                label={t('admin-panel-employees-edit:inputs.email.label')}
              />
            </Grid>

            <Grid item xs={12}>
              <FormTextInput<EditEmployeeFormData>
                name="firstName"
                testId="firstName"
                label={t('admin-panel-employees-edit:inputs.firstName.label')}
              />
            </Grid>

            <Grid item xs={12}>
              <FormTextInput<EditEmployeeFormData>
                name="lastName"
                testId="lastName"
                label={t('admin-panel-employees-edit:inputs.lastName.label')}
              />
            </Grid>

            <Grid item xs={12}>
              <FormTextInput<EditEmployeeFormData>
                name="salary"
                type="number"
                testId="salary"
                label={t('admin-panel-employees-edit:inputs.salary.label')}
              />
            </Grid>

            <Grid item xs={12}>
              <FormSelectInput<EditEmployeeFormData, Pick<Role, 'id'>>
                name="position"
                testId="position"
                label={t('admin-panel-employees-edit:inputs.position.label')}
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
                renderOption={(option) => t(`admin-panel-employees-edit:inputs.position.options.${option.id}`)}
              />
            </Grid>

            <Grid item xs={12}>
              <EditEmployeeFormActions />
              <Box ml={1} component="span">
                <Button variant="contained" color="inherit" LinkComponent={Link} href="/admin-panel/employees">
                  {t('admin-panel-employees-edit:actions.cancel')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}


function EditEmployee() {
  return (
    <>
      <FormEditEmployee />
    </>
  );
}

export default withPageRequiredAuth(EditEmployee);
